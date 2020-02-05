const { db } = require('../utils/admin');

exports.getComments = (req, res) => {
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

exports.postComment = (req, res) => {
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