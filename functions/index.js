const functions = require('firebase-functions');
const firebase = require('firebase');
const app = require('express')();
const {getComments, postComment} = require('./handlers/comments');

// Config to store and manipulation to data cloud
const FIREBASE_CONFIG = require('./firebaseConfig.json')


firebase.initializeApp(FIREBASE_CONFIG);

// comments route
app.get('/comments', getComments);
app.post('/newComment', FBAuth, postComment);


const FBAuth = (req, res, next) => {
    let idToken;

    if(req.headers.authorization &&  req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('Not token found')
        res.status(403).json({ error: 'Not authorized' })
    }
    admin.auth().verifyIdToken(idToken)
      .then( decodedToken => {
        req.user = decodedToken;
        console.log(decodedToken);
        return db.collection('users')
            .where('userId', '==', req.user.uid)
            .limit(1)
            .get();
    })
    .then(data => {
        req.user.handle = data.docs[0].data().handle;
        return next();
    })
    .catch(err => {
        console.error('Error While Verifying token', err);
        return res.status(403).json(err);

    })
}



const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if (string.trim() === '') return true;
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
    let errors = {};
    if (isEmpty(newUser.email)) {
        errors.email = 'Email is Required';
    } else if (!isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address'
    }

    if (isEmpty(newUser.password)) errors.password = 'Pasword is Required';
    if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Password not match';
    if (isEmpty(newUser.handle)) errors.handle = 'Username is Required';

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    // data Validation
    let token, userId;

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({
                    handle: 'This handle is taken'
                })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(
                    newUser.email,
                    newUser.password
                )
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(keyID => {
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
            return res.status(201).json({
                token
            });
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.json({
                    email: 'Email is already in use'
                })
            } else {
                return res.status(500).json({
                    error: err.code
                })
            }
        })
})

app.post('/signin', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    let errors = {}
    if (!isEmail(user.email)) {
        errors.email = 'Must be a valid email address'
    }
    if (isEmpty(user.email)) errors.email = 'Please insert your email';
    if (isEmpty(user.password)) errors.password = 'Please insert your password';

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(
            user.email,
            user.password
        )
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({
                token
            });
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/wrong-password') {
                return res.status(402).json({
                    general: 'Invalid user credentials, please try again'
                })
            } else {
                return res.status(500).json({
                    error: err.code
                });
            }
        });
})




exports.api = functions.region('us-central1').https.onRequest(app);