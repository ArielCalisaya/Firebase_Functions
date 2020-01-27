const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("../key/service_account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



const db = admin.firestore();


exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.getComments = functions.https.onRequest((req, res) => {
    db.collection("comments")
        .get()
        .then(data => {
            let comments = [];
            data.forEach(doc => {
                comments.push(doc.data());
            });
            return res.json(comments);
        })
        .catch(err => console.error(err));
});

exports.createComment = functions.https.onRequest((req, res) => {
    if(req.method !== 'POST'){
        return res.status(400).json({error: 'Method not allowed'})
    }

    const newComment = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    db.collection("comments")
        .add(newComment)
        .then(doc => {
            res.json({ message: `document ${doc.id} created succesfully`});
        })
        .catch(err => {
            res.status(500).json({ error: "something was wrong" });
            console.error(err);
        });
});
