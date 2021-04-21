/* - - - - - - - - - - - - - - - - - 
   Configurations for the Firebase
- - - - - - - - - - - - - - - - - - -  */

// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyCwceNNJxOmLiNQEWqA9_Kwo1p1L76Q9io",
    authDomain: "monaca-forum-app.firebaseapp.com",
    projectId: "monaca-forum-app",
    appId: "1:1085793196155:web:fc0b8a5e1490821723eade"
};

firebase.initializeApp(firebaseConfig);

// Make Auth and Firestore references
const auth = firebase.auth();
const db = firebase.firestore();