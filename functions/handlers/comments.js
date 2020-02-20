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
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: req.user.imageUrl
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
        createdAt: new Date().toISOString(),
        userImage: req.user.imageUrl,
        likeCount: 0,
        comentCount: 0
    };

    db.collection("comments")
        .add(newComment)
        .then((doc) => {
            const resComment = newComment;
            resComment.commentId = doc.id;
            res.json(resComment);
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
        return res.status(400).json({ comment: "comment must not be empty"})
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
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
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

// like on a comment
exports.likeComment = (req, res) => {
    const likeDoc = db.collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('commentId', '==', req.params.commentId).limit(1);

    const commentDoc = db.doc(`/comments/${req.params.commentId}`);

    let commentData = {};

    commentDoc
    .get()
        .then(doc => {
            if(doc.exists){
                commentData = doc.data();
                commentData.commentId = doc.id;
                return likeDoc.get();
            } else {
                return res.status(404).json({ error: "Comment not found" });
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('likes').add({
                    commentId: req.params.commentId,
                    userHandle: req.user.handle
                })
                .then(() => {
                    commentData.likeCount++
                    return commentDoc.update({ likeCount: commentData.likeCount })
                })
                .then(() => {
                    return res.json(commentData);
                })
            } else {
                return res.status(400).json({ error: "Comment already liked" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};


// unlike element
exports.unLikeComment = (req, res) => {
    const likeDoc = db.collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('commentId', '==', req.params.commentId).limit(1);

    const commentDoc = db.doc(`/comments/${req.params.commentId}`);

    let commentData = {};
    commentDoc.get()
        .then(doc => {
            if(doc.exists){
                commentData = doc.data();
                commentData.commentId = doc.id;
                return likeDoc.get();
            } else {
                return res.status(404).json({ error: "Comment not found" });
            }
        })
        .then(data => {
            if(data.empty){
                return res.status(400).json({ error: "Comment not liked" });
            } else {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                 .then(() => {
                     commentData.likeCount--;
                     return commentDoc.update({ likeCount: commentData.likeCount});
                 })
                  .then(() => {
                     res.json(commentData)
                  })
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: err.code })
        })
};

exports.DELETE_comment = (req, res) => {
    const document = db.doc(`/comments/${req.params.commentId}`);
    document.get() 
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({ error: "Request CommentId not found" })
        }
        if(doc.data().userHandle !== req.user.handle){
            return res.status(403).json({ error: 'Unauthorized' });
        } else {
            return document.delete();
        }
    })
    .then(() => {
        res.json({ message: 'Comment deleted Successfully'});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });

};