const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/notifications/{notificationId}').onWrite((event) => {
    console.log(event);

    const NOTIFICATION_SNAPSHOT = event.after._data ;
    console.log(NOTIFICATION_SNAPSHOT);
    const payload = {
        notification: {
            title: `New message from ${NOTIFICATION_SNAPSHOT.user}`,
            body: NOTIFICATION_SNAPSHOT.message,
            icons: NOTIFICATION_SNAPSHOT.userProfileImg,
            // click_action: `https://${functions.config().firebase.authDomain}`
        }
    };
    console.info(payload);

    return admin.database().ref('/tokens')
        .once('value')
        .then( (data) => {

            if(!data.val()) return;
            const snapshot = data.val();
            const tokens =[];

            for(let key in snapshot){
                tokens.push(snapshot[key].token);
            }
            return admin.messaging().sendToDevice(tokens, payload);
        })
});

// const payloadItem = {
//     notification: {
//         title: `New message from ${NOTIFICATION_SNAPSHOT.user}`,
//         body: NOTIFICATION_SNAPSHOT.message,
//         icons: NOTIFICATION_SNAPSHOT.userProfileImg,
//         // click_action: `https://${functions.config().firebase.authDomain}`
//     }
// };
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
