// Get Threads Data 
const getThreads = () => {
  db.collection('threads')
    .orderBy('created', 'desc')
    .get().then(snapshot => setUpThreads(snapshot.docs));
}

// Listen for Auth Status Changes
auth.onAuthStateChanged(user => (user) ? setUpUI(user) : setUpUI(user));

// Logout
const logoutBtn = document.querySelector('#logout');
logoutBtn.addEventListener('click', () => auth.signOut());

// Login
const signInForm = document.querySelector('#signin-form');
const signInBtn = document.querySelector('#sign-in');

signInBtn.addEventListener('click', () => {
  if (app.input.validate('#signin-email') && app.input.validate('#signin-password')) {
    // Get User Info
    const email = signInForm['signin-email'].value;
    const password = signInForm['signin-password'].value;

    // Sign In the User
    auth.signInWithEmailAndPassword(email, password).then(cred => {
      // Close the Sign In Popup and Reset the Form
      app.popup.close('.login-popup');
      signInForm.reset();
      signInForm.querySelector('.error').innerHTML = '';
    }).catch(error => {
      signInForm.querySelector('.error').innerHTML = error.message;
    });
  }
});

//Sign Up
const signUp = () => {
  const signUpForm = document.querySelector('#signup-form');
  const signUpBtn = document.querySelector('#sign-up');

  signUpBtn.addEventListener('click', () => {
    if (app.input.validate('#signup-email') && app.input.validate('#signup-password')) {
      // Get User Info
      const email = signUpForm['signup-email'].value;
      const password = signUpForm['signup-password'].value;

      // Sign Up The User
      auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // Close the Sign Up Popup and Reset the Form
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