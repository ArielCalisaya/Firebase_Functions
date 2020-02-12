const app = require('express')();
const FBAuth = require('./utils/FirebaseAuth');
const functions = require('firebase-functions');
const {Signup, Signin, setImage, reqUserDetails, GET_User} = require('./handlers/users');
const {getComments, postComment} = require('./handlers/comments');

// comments route
app.get('/comments', getComments);
app.post('/newComment', FBAuth, postComment);
app.get('comment/:commentId', GET_Comments);

// User Interaction
app.post('/signup', Signup);
app.post('/signin', Signin);
app.post('/user', FBAuth, reqUserDetails);
app.post('/user/image', FBAuth, setImage);
app.get('/user', FBAuth, GET_User);





exports.api = functions.region('us-central1').https.onRequest(app);