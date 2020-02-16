const app = require('express')();
const FBAuth = require('./utils/FirebaseAuth');
const functions = require('firebase-functions');
const {
    Signup, 
    Signin, 
    setImage, 
    reqUserDetails, 
    GET_User, 
    
} = require('./handlers/users');
const {
    getAllComments,
    GET_Comment,
    POST_Comment,
    userInComment,
    likeComment,
    unLikeComment
} = require('./handlers/comments');

// comments route
app.get('/comments', getAllComments);
app.post('/newComment', FBAuth, POST_Comment);
app.get('/comment/:commentId', GET_Comment);
app.get('/comment/:commentId/like', FBAuth, likeComment )
app.get('/comment/:commentId/unLike', FBAuth, unLikeComment)
app.post('/comment/:commentId/userInComment', FBAuth, userInComment)

// User Interaction
app.post('/signup', Signup);
app.post('/signin', Signin);
app.post('/user', FBAuth, reqUserDetails);
app.post('/user/image', FBAuth, setImage);
app.get('/user', FBAuth, GET_User);





exports.api = functions.region('us-central1').https.onRequest(app);