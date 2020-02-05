const functions = require('firebase-functions');
const firebase = require('firebase');
const app = require('express')();
const {getComments, postComment} = require('./handlers/comments');
const FBAuth = require('./utils/FirebaseAuth');
// comments route
app.get('/comments', getComments);
app.post('/newComment', FBAuth, postComment);


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
app.post('/signup', Signup)

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