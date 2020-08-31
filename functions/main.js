//optional
{
const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();

FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);

const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const subscribeButton = document.getElementById('subscribe');
const unsubscribeButton = document.getElementById('unsubscribe');
const sendNotificationForm = document.getElementById('send-notification-form');

    signInButton.addEventListener('click', singIn);
    signOutButton.addEventListener('click', singOut);
    subscribeButton.addEventListener('click', subscribeNotification);
    unsubscribeButton.addEventListener('click', unsubscribeNotifications);
    sendNotificationForm.addEventListener('submit', sendNotification);
    checkSubscription();

function singIn() {
    FIREBASE_AUTH.signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

function singOut() {
    FIREBASE_AUTH.signOut();
}

function handleAuthStateChanged(user) {
    if(user){
        signInButton.setAttribute("hidden", "true");
        signOutButton.removeAttribute("hidden");

        console.log(user)
    }else{
        signOutButton.setAttribute("hidden", "true");
        signInButton.removeAttribute("hidden");
        console.log("Users not signed in")
    }
}

function subscribeNotification() {
    FIREBASE_MESSAGING.requestPermission()
        .then( () => FIREBASE_MESSAGING.getToken())
        .then(( ) => HandlerefreashToken())
        .catch((error) => console.log(error));
}

function HandlerefreashToken(){
    return FIREBASE_MESSAGING.requestPermission()
        .then( () => FIREBASE_MESSAGING.getToken())
        .then((token) => {
            console.log(token);
            FIREBASE_DATABASE.ref('/tokens').push({
                token :token,
                uid: FIREBASE_AUTH.currentUser.uid
            })
        })
        .catch((error) => console.log(error));

}

function unsubscribeNotifications() {
    FIREBASE_MESSAGING.getToken()
        .then((token) => FIREBASE_MESSAGING.deleteToken(token))
        .then(() => FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid)
            .once('value'))
        .then((snapshot) => {
          console.log(snapshot.val())
            const key = Object.keys(snapshot.val( ))[0];
          return FIREBASE_DATABASE.ref('/tokens').child(key).remove();
        })
}

function checkSubscription(){
    FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid)
        .then((snapshot) => {
            if (snapshot.val()) {
                subscribeButton.setAttribute("hidden", "true");
                unsubscribeButton.removeAttribute("hidden");

            }else{
                unsubscribeButton.setAttribute("hidden", "true");
                subscribeButton.removeAttribute("hidden");
            }
        })
}

function sendNotification(e) {
    e.preventDefault();

    const notificationMessage = document.getElementById('notification-message').value;

    FIREBASE_DATABASE.ref('/notifications').push({
        user: FIREBASE_AUTH.currentUser.displayName,
        message : notificationMessage,
        userProfileImg: FIREBASE_AUTH.currentUser.photoURL
    }).then(() => {
        document.getElementById('notification-message').value = "";
    })
}

//Optional function
    function sendNotificationFunction(e) {
        e.preventDefault();

        const notificationMessage = document.getElementById('notification-message').value;

        FIREBASE_DATABASE.ref('/notifications').push({
            user: FIREBASE_AUTH.currentUser.displayName,
            message : notificationMessage,
            userProfileImg: FIREBASE_AUTH.currentUser.photoURL
        }).then(() => {
            document.getElementById('notification-message').value = "";
        })
    }




}
