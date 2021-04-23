// Get data 
db.collection('threads')
  .orderBy('created', 'desc')
  .onSnapshot(snapshot => {
    setUpThreads(snapshot.docs);
  });

// Listen for Auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    setUpUI(user);
  } else {
    setUpUI(user);
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

//Sign up
const signUp = () => {
  const signUpForm = document.querySelector('#signup-form');
  const signUpBtn = document.querySelector('#sign-up');

  signUpBtn.addEventListener('click', () => {
    if (app.input.validate('#signup-email') && app.input.validate('#signup-password')) {
      // Get user info
      const email = signUpForm['signup-email'].value;
      const password = signUpForm['signup-password'].value;

      // Sign up the user
      auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // Close the sign up popup and reset the form
        app.popup.close('.login-popup');
        app.dialog.alert('You have successfully registered and logged in.', '');
        signUpForm.reset();
        signUpForm.querySelector('.error').innerHTML = '';
      }).catch(error => {
        signUpForm.querySelector('.error').innerHTML = error.message;
      });
    }
  });
}