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

// Create New Thread
const newThread = () => {
  const createThreadForm = document.querySelector('#create-thread-form');
  const createThreadBtn = document.querySelector('#create-thread');

  createThreadBtn.addEventListener('click', () => {
    //TO DO: picture
    if (app.input.validate('#title') && app.input.validate('#description')) {
      db.collection('threads').add({
        title: createThreadForm['title'].value,
        description: createThreadForm['description'].value,
        created: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        app.dialog.close();
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
    const li = `
      <li class="swipeout">
        <div class="swipeout-content">
          <a href="/thread/${doc.id}/" data-thread-id="${doc.id}" class="item-link item-content thread-details">
            <div class="item-media"><img src="http://placehold.jp/40x40.png" width="44"/></div>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">${thread.title}</div>
              </div>
              <div class="item-subtitle">${thread.description}</div>
            </div>
          </a>
        </div>
        <div class="swipeout-actions-right">
          <a href="#" class="delete-thread-dialog">Delete</a>
        </div>
      </li>  
    `;
    html += li;
    count++;
  });
  threadsList.innerHTML = (count == 0) ? noThreads() : html;
}

// Display Text When There Is No Thread Added
const noThreads = () => {
  return `
    <div class="card demo-card-header-pic">
      <div class="card-content card-content-padding">
        <div class="list media-list no-ios-edges">
          <ul>
            <li class="item-content">
              <div class="item-inner">
                <div class="item-subtitle">No Threads Yet</div>
              </div>
            </li>
          </ul>
        </div>
        <p class="date">Be the first to create one!</p>
      </div>
    </div>`;
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
      });
    });
}

// Add New Comment
const newComment = (threadId) => {
  $$(document).on('click', '#add-comment', function () {
    const addCommentForm = document.querySelector('#add-comment-form');

    //TO DO: picture
    if (app.input.validate('#description')) {
      db.collection('comments').add({
        thread: threadId,
        user: firebase.auth().currentUser.uid,
        text: addCommentForm['description'].value,
        added: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
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
      if(id == comment.thread) {
        const li = `
          <div class="card demo-card-header-pic" id="${comment.user}">
            <div class="card-content card-content-padding">
              <div class="list media-list no-ios-edges">
                <ul>
                  <li class="item-content">
                    <div class="item-inner">
                      <div class="item-subtitle" id="comment-description">${comment.text}</div>
                    </div>
                  </li>
                </ul>
              </div>
              <p class="date" id="comment-date">${comment.added.toDate().toDateString()}  <span id="trash-icon"> <i class="icon f7-icons size-15 delete-comment-dialog" data-comment-id="${doc.id}">trash</i></span></p>
            </div>
          </div>`;
        html += li;
        count++;
      }
    });
    commentsList.innerHTML = (count == 0) ? noComments() : html;
  });
}

// Display Text When There Is No Comment Added
const noComments = () => {
  return `
    <div class="card demo-card-header-pic">
      <div class="card-content card-content-padding">
        <div class="list media-list no-ios-edges">
          <ul>
            <li class="item-content">
              <div class="item-inner">
                <div class="item-subtitle">No Comments Yet</div>
              </div>
            </li>
          </ul>
        </div>
        <p class="date">Be the first to share what you think!</p>
      </div>
    </div>`;
}

// Delete A Comment
const deleteComment = (commentId) => {
  let toDelete = db.collection('comments').where(firebase.firestore.FieldPath.documentId(), '==', commentId);
  toDelete.get().then(snapshot => {
    snapshot.forEach(doc => {
      const comment = doc.data();
      if(firebase.auth().currentUser.uid == comment.user)
        doc.ref.delete();
    });
  });
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
    content: ' <div class="page-content login-screen-content"> <div class="block-title">New Topic</div> <form class="list" id="create-thread-form"> <div class="list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <input type="text" id="title" name="title" placeholder="Thread Title" required validate/> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea id="description" name="description" placeholder="Description" required validate></textarea> </div> </div> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button" id="create-thread" href="#">Create Thread</a> <a class="button" id="cancel-thread" href="#">Cancel</a> </div> </form> </div>',
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
    content: '<div class="page-content login-screen-content"> <form class="list" id="add-comment-form"> <div class="list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea id="description" name="description" placeholder="Write your comment here" required validate></textarea> </div> </div> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button" id="add-comment" href="#">Submit</a>  <a class="button" id="cancel-comment" href="#">Cancel</a></div> </form> </div>',
    cssClass: 'dialog'
  }).open();
});

// Close The Comment Dialog
$$(document).on('click', '#cancel-comment', function () {
  app.dialog.close();
});

// Confirmation Dialog For Deleting a Thread

$$(document).on('click', '.delete-thread-dialog', function () {
  app.dialog.confirm(' Are you sure you want to delete the thread?', '', function () {
    // Delete thread function comes here
  });
});

// Confirmation Dialog For Deleting a Comment
$$(document).on('click', '.delete-comment-dialog', function () {
  let commentId = $$(this).data('comment-id');  
  app.dialog.confirm(' Are you sure you want to delete the comment?', '', function () {
    deleteComment(commentId);
  });
});