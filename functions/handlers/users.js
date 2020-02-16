const { db, admin } = require('../utils/admin');
const firebase = require('firebase');
const FIREBASE_CONFIG = require('../utils/tools/firebaseConfig');

// Config to store and manipulation to data cloud
firebase.initializeApp(FIREBASE_CONFIG)

const { validateSignupData, validateSigninData, reduceUserDetails } = require('../utils/validators');

// signup user nad creating credential token
exports.Signup = (req, res) => {
    newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }
    
    const {valid, errors} = validateSignupData(newUser);
    if(!valid) return res.status(400).json(errors);

    const defaultImage = 'default-profile.png'
    // data Validation
    let token, userId;

    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'This handle is taken' })
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
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_CONFIG.storageBucket}/o/${defaultImage}?alt=media`,
                userId
            };
            return db.doc(`users/${newUser.handle}`).set(userCredentials);
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

// login user with credential
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

// Get user with credential
exports.GET_User = (req, res) => {
    let userData = {}
    db.doc(`users/${req.user.handle}`).get()
    .then(doc => {
        if(!doc.exists){
            userData.credentials = doc.data();
            return db.collection('likes').where('userHandle', '==', req.user.handle).get()
        }
    })
    .then(data => {
        userData.likes = []
        data.forEach(doc => {
            userData.likes.push(doc.data());
        });
        return res.json(userData);
    })
    .catch(err => {
        console.error(err)
        return res.status(500).json({ error: err.code })
    })
};

// Add user info =[ bio, website, location, etc]
exports.reqUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(() => {
        return res.json({ message: "Details added succesfully"});
    })
    .catch((err) => {
        console.error(err)
        return res.status(500).json({ error: err.code })
    })
};

// profile image upload
exports.setImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: req.headers });

    let imageFilename;
    let imageToUpload = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, file,filename, mimetype, encoding);
        if(mimetype != 'image/png' && mimetype !== 'image/jpeg'){
            return res.status(400).json({ error : 'Wrong file type, only png and jpeg ext files' })
        }

        // Set extension .png
        const imageExt = filename.split('.')[filename.split('.').length -1]
        // generate random_nubmber.png
        imageFilename = `${Math.round(Math.random()*1011010011000)}.${imageExt}`;

        const filePath = path.join(os.tmpdir(), imageFilename);

        imageToUpload = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));

    }); 
    busboy.on('finish', () => {
        admin.storage()
        .bucket()
        .upload(imageToUpload.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToUpload.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_CONFIG.storageBucket}/o/${imageFilename}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
        })
        .then(() => {
            return res.json({ message: 'Image uploaded succesfully'});
        })
        .catch( err => {
            console.error(err)
            return res.status(500).json({ error: err.code });
        })
    })
    busboy.end(req.rawBody);
}