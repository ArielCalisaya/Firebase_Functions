const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');

const app = require('express')();

// Priority to run firebase
const SERVICE_ACCOUNT = require('./service_account.json')


// Config to store and manipulation to data cloud
const FIREBASE_CONFIG = require('./firebaseConfig.json')


firebase.initializeApp(FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT)
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
const isEmail = (email) => {
    const regEx = ''
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

// signup
app.post('/signup', (req, res) => {
    newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }
    let error = {};
    if(isEmpty(newUser.email)){
        error.email = 'Email is Required';
    } else if

    // data Validation
    let token, userId

    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({ handle: 'This handle is taken' })
        } else {
            return firebase.auth().createUserWithEmailAndPassword(
                newUser.email,
                newUser.password
            )
        }
    })
    .then( data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then( keyID => {
        token = keyID;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        db.doc(`users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => {
        return res.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return res.json({ email:'Email is already in use' })
        } else {
            return res.status(500).json({error: err.code })
        }        
    })

})




exports.api = functions.region('us-central1').https.onRequest(app);