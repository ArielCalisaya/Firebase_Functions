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


exports.api = functions.region('us-central1').https.onRequest(app);

exports.notificationsOnLike = functions.region('us-central1').firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        db.doc(`/comments/${snapshot.data().commentId}`).get()
            .then(doc => {
                if(doc.exists){
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
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err)
                return;
            })
    });

exports.notificationsOnComment = functions.region('us-central1')
.firestore.document('userInComments/{id}')
.onCreate((snapshot) => {
    db.doc(`/comments/${snapshot.data().commentId}`)
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
        .then(() => {
            return;
        })
        .catch(err => {
            console.error(err)
            return;
        })
});

exports.deleteNotificationsOnUnLike = functions.region('us-central1')
.firestore.document('likes/{id}')
.onDelete((snapshot) => {
    db.doc(`notifications/${snapshot.id}`)
        .delete()
        .then(() => {
            return;
        })
        .catch(err => {
            console.error(err)
            return;
        })
})