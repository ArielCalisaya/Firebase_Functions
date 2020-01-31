const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');

const app = require('express')();


// private
const serviceAccount = require('./service_account.json');

// public
const firebaseConfig = require('./firebaseConfig.json');


firebase.initializeApp(firebaseConfig);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/comments', (req, res) => {
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
        .catch((err) => console.error(err));
});

app.post('/newComment', (req, res) => {
    if (req.method !== "POST") {
        return res.status(400).json({
            error: "You not using post method"
        });
    }

    const newComment = {
        body: req.body.body,
        userHandle: req.body.userHandle,
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
});

// signup
app.post('/signup', (req, res) => {
    newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    // data Validation

    firebase.auth().createUserWithEmailAndPassword(
        newUser.email, 
        newUser.password
    )
    .then(data => {
        return res.status(201).json({ message: `user ${data.user.uid} Sign up Succesfully :D `});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    })
})




exports.api = functions.region('us-central1').https.onRequest(app);