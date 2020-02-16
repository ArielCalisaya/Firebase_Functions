const { db } = require('../utils/admin');

exports.getAllComments = (req, res) => {
    db.collection("comments")
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let comments = [];
            data.forEach((doc) => {
                comments.push({
                    commentId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(comments);
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({ error: err.code })
        });
};

// Display comment and comments of users
exports.GET_Comment = (req, res) => {
    let commentData = {};
    db.doc(`/comments/${req.params.commentId}`).get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({error: 'Comment not found'})
        }
        commentData = doc.data();
        commentData.commentId = doc.id;
        return db
        .collection('userInComments')
        .orderBy('createdAt', 'desc' )
        .where('commentId', '==', req.params.commentId)
        .get();
    })
    .then(data => {
        commentData.userInComments = [];
        data.forEach(doc => {
            commentData.userInComments.push(doc.data())
        });
        return res.json(commentData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code})
    })
};

// Post a comment 
exports.POST_Comment = (req, res) => {
    if(req.body.body.trim() === ''){
        return res.status(400).json({ body: 'Body is required' });
    }

    const newComment = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };

    db.collection("comments")
        .add(newComment)
        .then((doc) => {
            res.json({
                message: `document ${doc.id} created succesfully`
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: "something was wrong"
            });
            console.error(err);
        });
};

// Post user comment on a user post 
exports.userInComment = (req, res) => {
    if(req.body.body.trim() === ""){
        return res.status(400).json({ error: "comment must not be empty"})
    } 
    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        commentId: req.params.commentId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    }

    db.doc(`/comments/${req.params.commentId}`)
        .get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: "Request CommentId not found" })
            }
            return db.collection('userInComments').add(newComment)
        })
        .then(() => {
            res.json(newComment)    
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: `something went wrong: ${err.code}` });
        })
}