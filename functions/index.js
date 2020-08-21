const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/notifications/{notificationId}').onWrite((event) => {
    console.log(event);

    const NOTIFICATION_SNAPSHOT = event.after.DataSnapshot.data;
    const payload = {
        notification: {
            title: `New message from ${NOTIFICATION_SNAPSHOT.user}`,
            body: NOTIFICATION_SNAPSHOT.message,
            icons: NOTIFICATION_SNAPSHOT.userProfileImg,
            click_action: `https://${functions.config().firebase.authDomain}`
        }
    };
    console.info(payload);

});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
