const app = require('express')();
const FBAuth = require('./utils/FirebaseAuth');
const functions = require('firebase-functions');
const {Signup, Signin, setImage} = require('./handlers/users');
const {getComments, postComment} = require('./handlers/comments');

// comments route
app.get('/comments', getComments);
app.post('/newComment', FBAuth, postComment);

// User Interaction
app.post('/signup', Signup);
app.post('/signin', Signin);
app.post('/user/image', FBAuth, setImage);




exports.api = functions.region('us-central1').https.onRequest(app);