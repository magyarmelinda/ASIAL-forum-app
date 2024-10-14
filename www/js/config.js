/* - - - - - - - - - - - - - - - - - 
   Configurations for Firebase
- - - - - - - - - - - - - - - - - - -  */

// Firebase Configuration and Initialization
const firebaseConfig = {
  apiKey: "AIzaSyCwceNNJxOmLiNQEWqA9_Kwo1p1L76Q9io",
  authDomain: "monaca-forum-app.firebaseapp.com",
  databaseURL: "https://monaca-forum-app-default-rtdb.firebaseio.com",
  projectId: "monaca-forum-app",
  storageBucket: "monaca-forum-app.appspot.com",
  messagingSenderId: "1085793196155",
  appId: "1:1085793196155:web:fc0b8a5e1490821723eade",
};

firebase.initializeApp(firebaseConfig);

// Create references for Firebase Authentication and Firestore
const auth = firebase.auth();
const db = firebase.firestore();
