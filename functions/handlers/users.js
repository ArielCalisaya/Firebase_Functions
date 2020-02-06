const { db } = require('../utils/admin');
const firebase = require('firebase');
const FIREBASE_CONFIG = require('../utils/tools/firebaseConfig.json');

// Config to store and manipulation to data cloud
firebase.initializeApp(FIREBASE_CONFIG)

const { validateSignupData, validateSigninData } = require('../utils/validators');

exports.Signup = (req, res) => {
    newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }
    
    const {valid, errors} = validateSignupData(newUser);
    if(!valid) return res.status(400).json(errors);

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
};

exports.Signin = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };
    const {valid, errors} = validateSigninData(user);
    if(!valid) return res.status(400).json(errors);

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
};

exports.setImage = (req, res) => {
    
}