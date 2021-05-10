var $$ = Dom7;

var app = new Framework7({
  root: '#app', // App Root Element
  name: 'framework7-core-tab-view', // App Name
  theme: 'auto', // Automatic Theme Detection

  view: {
    stackPages: true, // For Navigation Between Multi-level Pages
  },
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
const uploadImage = (folder, element, id, type) => {
  let file = document.querySelector(element).files[0];

  if (file != undefined) {
    const ref = firebase.storage().ref(folder);
    const name = id + '.jpg';
    const source = '#' + id + '-img';
    const metadata = { contentType: file.type };

    ref.child(name).put(file, metadata)
      .then(snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == 100)
          snapshot.ref.getDownloadURL().then(url => document.querySelector(source).src = url);

      }).catch(error => {
        console.log(error);
      });
  }
}

// Display Thread/Comment image
const displayImage = (folder, id, element, background) => {
  const ref = firebase.storage().ref(folder);
  const name = id + '.jpg';

  ref.child(name)
    .getDownloadURL()
    .then(url => {
      (background) ?
        document.getElementById(element).style.backgroundImage = 'url(' + url + ')'
        : document.getElementById(element).src = url;
    }).catch(() => {
      document.getElementById(id + '-img').src = '/assets/icons/comments-icon.png';
    });
}

// Delete Thread/Comment's Picture
const deleteImage = (type, id) => {
  const ref = firebase.storage().ref(type).child(id + '.jpg');

  // Delete the file
  ref.delete().then(() => {
    // File Deleted Successfully
  }).catch(error => {
    console.error(error);
  });
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
        title: createThreadForm['title'].value,
        description: createThreadForm['description'].value,
        created: firebase.firestore.FieldValue.serverTimestamp()
      }).then(doc => {
        uploadImage('threads/', '#thread-img-upload', doc.id);
        app.dialog.close();
        createThreadForm.reset();
        getThreads();
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
    const li = `
      <li class="swipeout">
        <div class="swipeout-content">
          <a href="/thread/${doc.id}/" data-thread-id="${doc.id}" class="item-link item-content thread-details">
            <div class="item-media"><img id="${doc.id}-img" width="40" height="40"/></div>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">${thread.title}</div>
              </div>
              <div class="item-subtitle">${thread.description}</div>
            </div>
          </a>
        </div>
        <div class="swipeout-actions-right">
          <a href="#" class="delete-thread-dialog" data-thread-id="${doc.id}">Delete</a>
        </div>
      </li>  
    `;
    displayImage('threads/', doc.id, `${doc.id}-img`, false);
    html += li;
    count++;
  });
  threadsList.innerHTML = (count == 0) ?
    noContent('No Threads Yet', 'Be the first to create one!')
    : html;
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
    const addCommentBtn = document.querySelector('#add-comment');
    const addCommentForm = document.querySelector('#add-comment-form');

    if (app.input.validate('#description')) {
      addCommentBtn.classList.add('disabled');
      db.collection('comments').add({
        thread: id,
        user: firebase.auth().currentUser.uid,
        text: addCommentForm['description'].value,
        added: firebase.firestore.FieldValue.serverTimestamp()
      }).then((doc) => {
        uploadImage('comments/', '#comment-img-upload', doc.id, 'comment');
        app.dialog.close();
        addCommentForm.reset();
      });
    }
  });
}

// Setting Up The Comments
const setUpComments = (id) => {
  db.collection('comments')
    .orderBy('added', 'desc')
    .onSnapshot(snapshot => {
      const commentsList = document.querySelector('.comments');
      let count = 0;
      let html = '';
      snapshot.docs.forEach(doc => {
        const comment = doc.data();
        if (id == comment.thread) {
          const li = `
            <div class="card demo-card-header-pic" id="${comment.user}">
              <div class="card-content card-content-padding">
                <img id="${doc.id}-img" class="float-left enlarge-image" width="40" height="40"/>
                <p class="item-subtitle" id="comment-description">${comment.text}</p>
              </div>
              <p class="date" id="comment-date">${comment.added.toDate().toDateString()} <span id="trash-icon"> <i class="icon f7-icons size-15 delete-comment-dialog" data-comment-id="${doc.id}">trash</i></span></p>
            </div>`;
          displayImage('comments/', doc.id, `${doc.id}-img`, false);
          html += li;
          count++;
        }
      });
      commentsList.innerHTML = (count == 0) ?
        noContent('No Comments Yet', 'Be the first to share what you think!')
        : html;
    });
}

// Delete A Comment or A Thread
const deleteContent = (collection, id) => {
  let toDelete = db.collection(collection).where(firebase.firestore.FieldPath.documentId(), '==', id);
  toDelete.get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (firebase.auth().currentUser.uid == data.user)
        doc.ref.delete();
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
})

// Reload Home Page
$$(document).on('click', '.icon-back', function () {
  $$(document).on('page:init', '.page[data-name="home"]', function () {
    window.location.reload();
  });
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
  let id = $$(this).data('comment-id');
  app.dialog.confirm(' Are you sure you want to delete the comment?', '', function () {
    deleteContent('comments', id);
    deleteImage('comments/', id);
  });
});

// Displaying Modal to Enlarge Image
$$(document).on('click', '.enlarge-image', function () {
  const modal = document.querySelector('#enlarge-image');
  const modalImage = document.querySelector('#modal-image');
  const span = document.getElementsByClassName('close')[0];

  modal.style.display = "block";
  modalImage.src = this.src;
  span.onclick = () => modal.style.display = "none";
});