{

const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();

FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);

const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');

    signInButton.addEventListener('click', singIn);
    signOutButton.addEventListener('click', singOut);

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
}
