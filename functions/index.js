const app = require('express')();
const FBAuth = require('./utils/FirebaseAuth');
const functions = require('firebase-functions');
const { db } = require('./utils/admin');
const {
    Signup, 
    Signin, 
    setImage, 
    reqUserDetails, 
    GET_User, 
    Get_userDetails,
    markNotificationsRead
} = require('./handlers/users');
const {
    getAllComments,
    GET_Comment,
    POST_Comment,
    DELETE_comment,
    userInComment,
    likeComment,
    unLikeComment
} = require('./handlers/comments');

// comments route
app.get('/comments', getAllComments);
app.post('/newComment', FBAuth, POST_Comment);
app.get('/comment/:commentId', GET_Comment);
app.delete('/comment/:commentId', FBAuth, DELETE_comment)
app.get('/comment/:commentId/like', FBAuth, likeComment )
app.get('/comment/:commentId/unLike', FBAuth, unLikeComment)
app.post('/comment/:commentId/userInComment', FBAuth, userInComment)

// User Interaction
app.post('/signup', Signup);
app.post('/signin', Signin);
app.post('/user', FBAuth, reqUserDetails);
app.post('/user/image', FBAuth, setImage);
app.get('/user', FBAuth, GET_User);
app.get('/user/:handle', Get_userDetails);
app.post('/notifications', FBAuth, markNotificationsRead);


exports.api = functions.region('us-central1').https.onRequest(app);

exports.notificationsOnLike = functions.region('us-central1').firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/comments/${snapshot.data().commentId}`).get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){

                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        commentId: doc.id
                    }); 
                }
            })
            .catch((err) => 
                console.error(err))
    });

exports.notificationsOnComment = functions.region('us-central1')
.firestore.document('userInComments/{id}')
.onCreate((snapshot) => {
    return db.doc(`/comments/${snapshot.data().commentId}`)
        .get()
        .then(doc => {
            if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'comment',
                    read: false,
                    commentId: doc.id
                }); 
            }
        })
        .catch(err => {
            console.error(err)
            return;
        })
});

exports.deleteNotificationsOnUnLike = functions.region('us-central1')
.firestore.document('likes/{id}')
.onDelete((snapshot) => {
    return db.doc(`notifications/${snapshot.id}`)
        .delete()
        .catch(err => {
            console.error(err)
            return;
        })
})

exports.userImageChange = functions.region('us-central1')
.firestore.document('/users/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            console.log('Image succesfully changed');
            const batch = db.batch();
            return db
                .collection('comments')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then((data) => {
                  data.forEach((doc) => {
                    const comment = db.doc(`/comments/${doc.id}`);
                    batch.update(comment, { userImage: change.after.data().imageUrl });
                });
            return batch.commit();
        })
    } else return true;
});

exports.commentDelete = functions
.region('us-central1')
.firestore.document('/comments/{commentId}')
.onDelete((snapshot, context) => {
    const commentId = context.params.commentId;
    const batch = db.batch();
    return db
        .collection('userInComments')
        .where('commentId', '==', commentId)
        .get()
        .then((data) => {
            data.forEach((doc) => {
                batch.delete(db.doc(`/userInComments/${doc.id}`));
            })
            return db
                .collection('likes')
                .where('commentId', '==', commentId)
                .get();
        })
        .then(data => {
            data.forEach(doc => {
                batch.delete(db.doc(`/likes/${doc.id}`));
            })
            return db
                .collection('notifications')
                .where('commentId', '==', commentId)
                .get();
        })
        .then(data => {
            data.forEach(doc => {
                batch.delete(db.doc(`/notifications/${doc.id}`));
            })
            return batch.commit();
        })
        .catch(err => console.error(err));
})