const SERVICE_ACCOUNT = require('./tools/service_account.json');
const admin = require('firebase-admin');

// Priority to run firebase
admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    storageBucket: "social-media-d9c51.appspot.com",
    databaseURL: "https://social-media-d9c51.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };