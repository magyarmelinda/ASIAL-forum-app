// Get data
db.collection('threads').get().then(snapshot => {
  setUpThreads(snapshot.docs);
});

// Listen for Auth status changes
auth.onAuthStateChanged(user => {
  if(user) {
    console.log('User logged in: ', user);
  } else {
    console.log('User is logged out.');
  }
});

// Logout
const logoutBtn = document.querySelector('#logout');
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

// Login
const signInForm = document.querySelector('#signin-form');
const signInBtn = document.querySelector('#sign-in');

signInBtn.addEventListener('click', () => {
  if (app.input.validate('#signin-email') && app.input.validate('#signin-password')) {
    // Get user info
    const email = signInForm['signin-email'].value;
    const password = signInForm['signin-password'].value;

    // Sign in the user
    auth.signInWithEmailAndPassword(email, password).then(cred => {
      // Close the sign in popup and reset the form
      app.popup.close('.login-popup');
      signInForm.reset();
      signInForm.querySelector('.error').innerHTML = '';
    }).catch(error => {
      signInForm.querySelector('.error').innerHTML = error.message;
    });
  }
});
