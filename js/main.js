{

const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();

FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);

const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const subscribeButton = document.getElementById('subscribe');


    signInButton.addEventListener('click', singIn);
    signOutButton.addEventListener('click', singOut);
    subscribeButton.addEventListener('click', subscribeNotification);

function singIn() {
    FIREBASE_AUTH.signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

function singOut() {
    FIREBASE_AUTH.signOut();
}

function handleAuthStateChanged(user) {
    if(user){
        console.log(user)
    }else{
        console.log("Users not signed in")
    }
}

function subscribeNotification() {
    FIREBASE_MESSAGING.requestPermission()
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
}
