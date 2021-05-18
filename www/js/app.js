var $$ = Dom7;

var app = new Framework7({
  root: '#app', // App Root Element
  name: 'framework7-core-tab-view', // App Name
  theme: 'auto', // Automatic Theme Detection

  data: function () {
    return {
      // App Root Data
    };
  },
  methods: {
    // App Root Methods
  },
  routes: routes, // App Routes
});

const threadsList = document.querySelector('.threads');
const signedInLinks = document.querySelectorAll('.signed-in');
const signedOutLinks = document.querySelectorAll('.signed-out');

const setUpUI = (user) => {
  if (user) {
    // Toggle UI Elements
    signedInLinks.forEach(item => item.style.display = 'inline');
    signedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // Toggle UI Elements
    signedInLinks.forEach(item => item.style.display = 'none');
    signedOutLinks.forEach(item => item.style.display = 'inline');
  }
}

// Upload Thread/Comment Image to Firebase Storage
const uploadImage = (folder, element, id, thread) => {
  let file = document.querySelector(element).files[0];

  if (file != undefined) {
    const ref = firebase.storage().ref(folder);
    const name = id + '.jpg';
    const source = '#' + id + '-img';
    const metadata = { contentType: file.type };

    ref.child(name).put(file, metadata)
      .then(snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == 100) {
          (folder == 'threads/') ? getThreads() : setUpComments(thread);
          app.dialog.close();
        }
      }).catch(error => console.log(error));
  } else setUpComments(thread);
}

// Display Thread/Comment Image
const displayImage = (folder, id, element, background) => {
  const ref = firebase.storage().ref(folder);
  const name = id + '.jpg';

  ref.child(name)
    .getDownloadURL()
    .then(url => {
      (background)
        ? document.getElementById(element).style.backgroundImage = 'url(' + url + ')'
        : document.getElementById(element).src = url;
    }).catch();
}

// Delete Thread/Comment's Picture
const deleteImage = (type, id) => {
  const ref = firebase.storage().ref(type).child(id + '.jpg');
  // Delete the file
  ref.delete();
}

// Create New Thread
const newThread = () => {
  const createThreadForm = document.querySelector('#create-thread-form');
  const createThreadBtn = document.querySelector('#create-thread');

  createThreadBtn.addEventListener('click', () => {
    if (app.input.validate('#title') &&
      app.input.validate('#description') &&
      app.input.validate('#thread-img-upload')) {
      createThreadBtn.classList.add('disabled');
      db.collection('threads').add({
        user: firebase.auth().currentUser.uid,
        email: firebase.auth().currentUser.email,
        title: createThreadForm['title'].value,
        description: createThreadForm['description'].value,
        created: firebase.firestore.Timestamp.now()
      }).then(doc => {
        uploadImage('threads/', '#thread-img-upload', doc.id);
        createThreadForm.reset();
      });
    }
  });
}

// Setting Up The Threads
const setUpThreads = (data) => {
  let count = 0;
  let html = '';
  data.forEach(doc => {
    const thread = doc.data();
    let email = thread.email.split('@');
    let username = email[0];
    const li = `
      <li class="swipeout thread" id="${thread.user}">
        <div class="swipeout-content">
          <a href="/thread/${doc.id}/" data-thread-id="${doc.id}" class="item-link item-content thread-details">
            <div class="item-media"><img id="${doc.id}-img" class="lazy lazy-fade-in" width="40" height="40"/></div>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">${thread.title}  
                  <div class="display-inline item-text">${username}</div>
                </div>
              </div>
              <div class="item-text">${thread.description}</div>
            </div>
          </a>
        </div>
        <div class="swipeout-actions-right">
          <a href="#" class="delete-thread-dialog" data-thread-id="${doc.id}">Delete</a>
        </div>
      </li> `;
    displayImage('threads/', doc.id, `${doc.id}-img`, false);
    html += li;
    count++;
  });
  threadsList.innerHTML = (count == 0)
    ? noContent('No Threads Yet', 'Be the first to create one!')
    : html;

  deleteOption('.thread', '.swipeout-actions-right');
}

// Setting Up The Thread Details
const setUpThreadDetails = (id) => {
  db.collection('threads')
    .where(firebase.firestore.FieldPath.documentId(), "==", id)
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const thread = doc.data();
        document.getElementById("thread-title").innerText = thread.title;
        document.getElementById("thread-description").innerText = thread.description;
        displayImage('threads/', doc.id, 'thread-img', true);
      });
    });
}

// Add New Comment
const newComment = (id) => {
  $$(document).on('click', '#add-comment', function () {
    const addCommentForm = document.querySelector('#add-comment-form');
    const addCommentBtn = document.querySelector('#add-comment');

    if (app.input.validate('#description')) {
      addCommentBtn.classList.add('disabled');
      db.collection('comments').add({
        thread: id,
        user: firebase.auth().currentUser.uid,
        text: addCommentForm['description'].value,
        added: firebase.firestore.Timestamp.now(),
        picture: document.querySelector('#comment-img-upload').files[0] != undefined
      }).then((doc) => {
        uploadImage('comments/', '#comment-img-upload', doc.id, id);
        app.dialog.close();
        addCommentForm.reset();
      });
    }
  });
}

// Setting Up The Comments
const setUpComments = (id) => {
  db.collection('comments')
    .orderBy('added', 'asc')
    .get()
    .then(snapshot => {
      const commentsList = document.querySelector('.comments');
      let count = 0;
      let html = '';
      snapshot.docs.forEach(doc => {
        const comment = doc.data();
        if (id == comment.thread) {
          const li = `
            <div class="card demo-card-header-pic comment" id="${comment.user}">
              <div class="card-content card-content-padding">
                <img id="${doc.id}-img" src="./assets/comments-icon.png" class="float-left lazy lazy-fade-in enlarge-image" width="40" height="40"/>
                <p class="item-subtitle" id="comment-description">${comment.text}</p>
              </div>
              <p class="date" id="comment-date">${comment.added.toDate().toDateString()} <span id="trash-icon"> <i class="icon f7-icons size-15 delete-comment-dialog" data-thread-id="${comment.thread}" data-comment-id="${doc.id}" data-comment-img="${comment.picture}">trash</i></span></p>
            </div>`;
          if (comment.picture)
            displayImage('comments/', doc.id, `${doc.id}-img`, false);
          html += li;
          count++;
        }
      });
      commentsList.innerHTML = (count == 0)
        ? noContent('No Comments Yet', 'Be the first to share what you think!')
        : html;

      deleteOption('.comment', '#trash-icon');
    });
}

// Displaying Modal to Enlarge Image
$$(document).on('click', '.enlarge-image', function () {
  const newCommentBtn = document.querySelector('#new-comment');
  const modal = document.querySelector('#enlarge-image');
  const modalImage = document.querySelector('#modal-image');
  const span = document.getElementsByClassName('close')[0];

  newCommentBtn.classList.add('display');
  modal.style.display = "block";
  modalImage.src = this.src;

  span.onclick = () => {
    modal.style.display = "none";
    newCommentBtn.classList.remove('display');
  }
});

// Show Delete For Content Creator
const deleteOption = (element, content) => {
  const elements = document.querySelectorAll(element);

  auth.onAuthStateChanged(user => {
    if (user) {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].id == firebase.auth().currentUser.uid)
          elements[i].querySelector(content).classList.remove('display');
        else elements[i].querySelector(content).classList.add('display');
      }
    } else {
      for (let i = 0; i < elements.length; i++)
        elements[i].querySelector(content).classList.add('display');
    }
  });
}

// Delete A Comment or A Thread
const deleteContent = (collection, id) => {
  let toDelete = db.collection(collection).where(firebase.firestore.FieldPath.documentId(), '==', id);
  toDelete.get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (firebase.auth().currentUser.uid == data.user) {
        doc.ref.delete().then(() => {
          (collection == 'threads') ? getThreads() : setUpComments(data.thread);
        });
      }
    });
  });
}

// Display Text When There Is No Thread/Comment Added
const noContent = (title, text) => {
  return `
    <div class="card-content card-content-padding">
      <div class="item-subtitle">${title}</div>    
      <p class="date" id="text">${text}</p>
    </div>
  `;
}

// Event Listeners
// Get Data for Thread Details Page
$$(document).on('click', '.thread-details', function () {
  const id = $$(this).data('thread-id');
  setUpThreadDetails(id);
  setUpComments(id);
  newComment(id);
});

// Pop Up With Swipe To Close
const loginSwipeToClosePopup = app.popup.create({
  el: '.login-popup',
  swipeToClose: true,
});

// Dialogs 
// Open a Dialog For Adding a New Thread
$$('.new-thread-dialog').on('click', function () {
  app.dialog.create({
    content: ' <div class="page-content login-screen-content"> <div class="block-title">New Topic</div> <form class="list" id="create-thread-form"> <div class="list" id="dialog-list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <input type="text" id="title" name="title" placeholder="Thread Title" required validate/> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea id="description" name="description" placeholder="Description" required validate></textarea> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> <input type="file" id="thread-img-upload" required validate> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button" id="create-thread" href="#">Create Thread</a> <a class="button" id="cancel-thread" href="#">Cancel</a> </div> </form> </div>',
    cssClass: 'dialog'
  }).open();

  newThread();
});

// Close The Thread Dialog
$$(document).on('click', '#cancel-thread', function () {
  app.dialog.close();
});

// Open a Dialog For Adding a New Comment
$$(document).on('click', '.new-comment-dialog', function () {
  app.dialog.create({
    content: '<div class="page-content login-screen-content"> <form class="list" id="add-comment-form"> <div class="list" id="dialog-list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea id="description" name="description" placeholder="Write your comment here" required validate></textarea> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> <input type="file" id="comment-img-upload"> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button" id="add-comment" href="#">Submit</a>  <a class="button" id="cancel-comment" href="#">Cancel</a></div> </form> </div>',
    cssClass: 'dialog'
  }).open();
});

// Close The Comment Dialog
$$(document).on('click', '#cancel-comment', function () {
  app.dialog.close();
});

// Confirmation Dialog For Deleting a Thread
$$(document).on('click', '.delete-thread-dialog', function () {
  let id = $$(this).data('thread-id');
  app.dialog.confirm(' Are you sure you want to delete the thread?', '', function () {
    deleteContent('threads', id);
    deleteImage('threads/', id);
  });
});

// Confirmation Dialog For Deleting a Comment
$$(document).on('click', '.delete-comment-dialog', function () {
  let thread = $$(this).data('thread-id');
  let id = $$(this).data('comment-id');
  let image = $$(this).data('comment-img');
  app.dialog.confirm(' Are you sure you want to delete the comment?', '', function () {
    deleteContent('comments', id);
    (image == 'true') ? deleteImage('comments/', id) : setUpComments(thread);
  });
});