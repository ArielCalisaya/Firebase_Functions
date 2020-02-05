const { db } = require('../utils/admin');
const firebase = require('firebase');
const FIREBASE_CONFIG = require('../tools/config/firebaseConfig.json')

// Config to store and manipulation to data cloud
firebase.initializeApp(FIREBASE_CONFIG)


exports.Signup = (req, res) => {
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
};