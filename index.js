const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});





exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");