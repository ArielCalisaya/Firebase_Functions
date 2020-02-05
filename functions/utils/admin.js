const SERVICE_ACCOUNT = require('./tools/service_account.json');
const admin = require('firebase-admin');

// Priority to run firebase
admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT)
});

const db = admin.firestore();

module.exports = { admin, db };