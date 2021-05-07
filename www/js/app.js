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
  const ref = firebase.storage().ref(folder);
  let file = document.querySelector(element).files[0];

  if(type == 'comment' && file == undefined) {
    // TO DO: correcting
    document.querySelector(element).src = 'data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQ0NC4zOTQgMy45OTZoLTI4NS4wNzJjLTM3LjE4MyAwLTY3LjYwNiAzMC40MjMtNjcuNjA2IDY3LjYwNnYyMy4wMDRoMjU3Ljg3MWMzNy4xODMgMCA2Ny42MDYgMzAuNDIzIDY3LjYwNiA2Ny42MDZ2MTY4LjU0N2gyNy4yMDFjMzcuMTgzIDAgNjcuNjA2LTMwLjQyMyA2Ny42MDYtNjcuNjA2di0xOTEuNTUxYzAtMzcuMTg0LTMwLjQyMy02Ny42MDYtNjcuNjA2LTY3LjYwNnoiIGZpbGw9IiM2YzdlZDYiLz48cGF0aCBkPSJtMzk2LjQ2MSA5MS41MTVoLTI4NS4wNzJjLTYuODM2IDAtMTMuNDQxIDEuMDM2LTE5LjY3MyAyLjk0NnYuMTQ1aDI1Ny44NzFjMzcuMTgzIDAgNjcuNjA2IDMwLjQyMyA2Ny42MDYgNjcuNjA2djE2OC41NDdoMjcuMmM2LjgzNiAwIDEzLjQ0MS0xLjAzNiAxOS42NzMtMi45NDZ2LTE2OC42OTJjLjAwMS0zNy4xODMtMzAuNDIyLTY3LjYwNi02Ny42MDUtNjcuNjA2eiIgZmlsbD0iIzRmNjdkMiIvPjxwYXRoIGQ9Im0zNTIuNjc4IDkxLjUxNWgtMjg1LjA3MmMtMzcuMTgzIDAtNjcuNjA2IDMwLjQyMy02Ny42MDYgNjcuNjA2djE5MS41NWMwIDM3LjE4MyAzMC40MjMgNjcuNjA2IDY3LjYwNiA2Ny42MDZoMTcxLjA5NmM3LjMzNSAwIDEyLjgxMSA2LjgyNiAxMS4xMzMgMTMuOTY2LTQuNTM3IDE5LjMxNy0xMS40OCAzOS43NDUtMjEuNzQ0IDYwLjY4Ni00LjYwOSA5LjQwNSA1Ljg3NiAxOC45NjYgMTQuNzgyIDEzLjQ1NCAyNS43NTEtMTUuOTM3IDYyLjM4OS00Mi42MSA5My4yNDQtODAuMzE3IDQuMDU2LTQuOTU3IDEwLjE1Ni03Ljc5IDE2LjU2MS03Ljc5IDM3LjE4MyAwIDY3LjYwNi0zMC40MjMgNjcuNjA2LTY3LjYwNnYtMTkxLjU1YzAtMzcuMTgyLTMwLjQyMy02Ny42MDUtNjcuNjA2LTY3LjYwNXoiIGZpbGw9IiM2MGI4ZmUiLz48cGF0aCBkPSJtMjkzLjYxOCA0MzIuMjQzYzEuNjc3LTcuMTQxLTMuNzk4LTEzLjk2Ni0xMS4xMzMtMTMuOTY2aC00My43ODNjNy4zMzUgMCAxMi44MSA2LjgyNSAxMS4xMzMgMTMuOTY2LTQuNTM3IDE5LjMxNy0xMS40OCAzOS43NDUtMjEuNzQ0IDYwLjY4Ni00LjYwOSA5LjQwNSA1Ljg3NiAxOC45NjYgMTQuNzgyIDEzLjQ1NCA5Ljg4LTYuMTE1IDIxLjM2NS0xMy44MTYgMzMuNTA5LTIzLjEwOCA3LjgzMi0xNy41NjMgMTMuMzk5LTM0LjY5NiAxNy4yMzYtNTEuMDMyeiIgZmlsbD0iIzIzYThmZSIvPjxwYXRoIGQ9Im00My43ODMgMzUwLjY3MXYtMTkxLjU1YzAtMzcuMTgzIDMwLjQyMy02Ny42MDYgNjcuNjA2LTY3LjYwNmgtNDMuNzgzYy0zNy4xODMgMC02Ny42MDYgMzAuNDIzLTY3LjYwNiA2Ny42MDZ2MTkxLjU1YzAgMzcuMTgzIDMwLjQyMyA2Ny42MDYgNjcuNjA2IDY3LjYwNmg0My43ODNjLTM3LjE4NCAwLTY3LjYwNi0zMC40MjItNjcuNjA2LTY3LjYwNnoiIGZpbGw9IiMyM2E4ZmUiLz48ZyBmaWxsPSIjZGZlYmZhIj48Y2lyY2xlIGN4PSI5My43MTQiIGN5PSIyNjAuMzk3IiByPSIyMi40MzQiLz48Y2lyY2xlIGN4PSIxNjYuMTc0IiBjeT0iMjYwLjM5NyIgcj0iMjIuNDM0Ii8+PGNpcmNsZSBjeD0iMjM4LjYzMyIgY3k9IjI2MC4zOTciIHI9IjIyLjQzNCIvPjxjaXJjbGUgY3g9IjMxMS4wOTMiIGN5PSIyNjAuMzk3IiByPSIyMi40MzQiLz48L2c+PHBhdGggZD0ibTkzLjcxNCAyNjAuMzk3YzAtOC4zMDIgNC41MTQtMTUuNTQ2IDExLjIxNy0xOS40MjUtMy4zMDEtMS45MS03LjEyOS0zLjAwOS0xMS4yMTctMy4wMDktMTIuMzkgMC0yMi40MzQgMTAuMDQ0LTIyLjQzNCAyMi40MzRzMTAuMDQ0IDIyLjQzNCAyMi40MzQgMjIuNDM0YzQuMDg4IDAgNy45MTctMS4wOTkgMTEuMjE3LTMuMDA5LTYuNzA0LTMuODc5LTExLjIxNy0xMS4xMjMtMTEuMjE3LTE5LjQyNXoiIGZpbGw9IiNiMWRiZmMiLz48cGF0aCBkPSJtMTY2LjE3NCAyNjAuMzk3YzAtOC4zMDIgNC41MTQtMTUuNTQ2IDExLjIxNy0xOS40MjUtMy4zMDEtMS45MS03LjEyOS0zLjAwOS0xMS4yMTctMy4wMDktMTIuMzkgMC0yMi40MzQgMTAuMDQ0LTIyLjQzNCAyMi40MzRzMTAuMDQ0IDIyLjQzNCAyMi40MzQgMjIuNDM0YzQuMDg4IDAgNy45MTYtMS4wOTkgMTEuMjE3LTMuMDA5LTYuNzA0LTMuODc5LTExLjIxNy0xMS4xMjMtMTEuMjE3LTE5LjQyNXoiIGZpbGw9IiNiMWRiZmMiLz48cGF0aCBkPSJtMjM4LjYzMyAyNjAuMzk3YzAtOC4zMDIgNC41MTQtMTUuNTQ2IDExLjIxNy0xOS40MjUtMy4zMDEtMS45MS03LjEzLTMuMDA5LTExLjIxNy0zLjAwOS0xMi4zOSAwLTIyLjQzNCAxMC4wNDQtMjIuNDM0IDIyLjQzNHMxMC4wNDQgMjIuNDM0IDIyLjQzNCAyMi40MzRjNC4wODggMCA3LjkxNy0xLjA5OSAxMS4yMTctMy4wMDktNi43MDMtMy44NzktMTEuMjE3LTExLjEyMy0xMS4yMTctMTkuNDI1eiIgZmlsbD0iI2IxZGJmYyIvPjxwYXRoIGQ9Im0zMTEuMDkzIDI2MC4zOTdjMC04LjMwMiA0LjUxMy0xNS41NDYgMTEuMjE3LTE5LjQyNS0zLjMwMS0xLjkxLTcuMTMtMy4wMDktMTEuMjE3LTMuMDA5LTEyLjM5IDAtMjIuNDM0IDEwLjA0NC0yMi40MzQgMjIuNDM0czEwLjA0NCAyMi40MzQgMjIuNDM0IDIyLjQzNGM0LjA4OCAwIDcuOTE3LTEuMDk5IDExLjIxNy0zLjAwOS02LjcwNC0zLjg3OS0xMS4yMTctMTEuMTIzLTExLjIxNy0xOS40MjV6IiBmaWxsPSIjYjFkYmZjIi8+PC9zdmc+';
    file = document.querySelector(element).src;
  }
    const name = id + '.jpg';
  const metadata = { contentType: file.type };

  ref.child(name).put(file, metadata)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      // console.log(url);
    }).catch(error => {
      console.log(error);
    });
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
    }).catch( () => {
      document.getElementById(element).src = 'data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQ0NC4zOTQgMy45OTZoLTI4NS4wNzJjLTM3LjE4MyAwLTY3LjYwNiAzMC40MjMtNjcuNjA2IDY3LjYwNnYyMy4wMDRoMjU3Ljg3MWMzNy4xODMgMCA2Ny42MDYgMzAuNDIzIDY3LjYwNiA2Ny42MDZ2MTY4LjU0N2gyNy4yMDFjMzcuMTgzIDAgNjcuNjA2LTMwLjQyMyA2Ny42MDYtNjcuNjA2di0xOTEuNTUxYzAtMzcuMTg0LTMwLjQyMy02Ny42MDYtNjcuNjA2LTY3LjYwNnoiIGZpbGw9IiM2YzdlZDYiLz48cGF0aCBkPSJtMzk2LjQ2MSA5MS41MTVoLTI4NS4wNzJjLTYuODM2IDAtMTMuNDQxIDEuMDM2LTE5LjY3MyAyLjk0NnYuMTQ1aDI1Ny44NzFjMzcuMTgzIDAgNjcuNjA2IDMwLjQyMyA2Ny42MDYgNjcuNjA2djE2OC41NDdoMjcuMmM2LjgzNiAwIDEzLjQ0MS0xLjAzNiAxOS42NzMtMi45NDZ2LTE2OC42OTJjLjAwMS0zNy4xODMtMzAuNDIyLTY3LjYwNi02Ny42MDUtNjcuNjA2eiIgZmlsbD0iIzRmNjdkMiIvPjxwYXRoIGQ9Im0zNTIuNjc4IDkxLjUxNWgtMjg1LjA3MmMtMzcuMTgzIDAtNjcuNjA2IDMwLjQyMy02Ny42MDYgNjcuNjA2djE5MS41NWMwIDM3LjE4MyAzMC40MjMgNjcuNjA2IDY3LjYwNiA2Ny42MDZoMTcxLjA5NmM3LjMzNSAwIDEyLjgxMSA2LjgyNiAxMS4xMzMgMTMuOTY2LTQuNTM3IDE5LjMxNy0xMS40OCAzOS43NDUtMjEuNzQ0IDYwLjY4Ni00LjYwOSA5LjQwNSA1Ljg3NiAxOC45NjYgMTQuNzgyIDEzLjQ1NCAyNS43NTEtMTUuOTM3IDYyLjM4OS00Mi42MSA5My4yNDQtODAuMzE3IDQuMDU2LTQuOTU3IDEwLjE1Ni03Ljc5IDE2LjU2MS03Ljc5IDM3LjE4MyAwIDY3LjYwNi0zMC40MjMgNjcuNjA2LTY3LjYwNnYtMTkxLjU1YzAtMzcuMTgyLTMwLjQyMy02Ny42MDUtNjcuNjA2LTY3LjYwNXoiIGZpbGw9IiM2MGI4ZmUiLz48cGF0aCBkPSJtMjkzLjYxOCA0MzIuMjQzYzEuNjc3LTcuMTQxLTMuNzk4LTEzLjk2Ni0xMS4xMzMtMTMuOTY2aC00My43ODNjNy4zMzUgMCAxMi44MSA2LjgyNSAxMS4xMzMgMTMuOTY2LTQuNTM3IDE5LjMxNy0xMS40OCAzOS43NDUtMjEuNzQ0IDYwLjY4Ni00LjYwOSA5LjQwNSA1Ljg3NiAxOC45NjYgMTQuNzgyIDEzLjQ1NCA5Ljg4LTYuMTE1IDIxLjM2NS0xMy44MTYgMzMuNTA5LTIzLjEwOCA3LjgzMi0xNy41NjMgMTMuMzk5LTM0LjY5NiAxNy4yMzYtNTEuMDMyeiIgZmlsbD0iIzIzYThmZSIvPjxwYXRoIGQ9Im00My43ODMgMzUwLjY3MXYtMTkxLjU1YzAtMzcuMTgzIDMwLjQyMy02Ny42MDYgNjcuNjA2LTY3LjYwNmgtNDMuNzgzYy0zNy4xODMgMC02Ny42MDYgMzAuNDIzLTY3LjYwNiA2Ny42MDZ2MTkxLjU1YzAgMzcuMTgzIDMwLjQyMyA2Ny42MDYgNjcuNjA2IDY3LjYwNmg0My43ODNjLTM3LjE4NCAwLTY3LjYwNi0zMC40MjItNjcuNjA2LTY3LjYwNnoiIGZpbGw9IiMyM2E4ZmUiLz48ZyBmaWxsPSIjZGZlYmZhIj48Y2lyY2xlIGN4PSI5My43MTQiIGN5PSIyNjAuMzk3IiByPSIyMi40MzQiLz48Y2lyY2xlIGN4PSIxNjYuMTc0IiBjeT0iMjYwLjM5NyIgcj0iMjIuNDM0Ii8+PGNpcmNsZSBjeD0iMjM4LjYzMyIgY3k9IjI2MC4zOTciIHI9IjIyLjQzNCIvPjxjaXJjbGUgY3g9IjMxMS4wOTMiIGN5PSIyNjAuMzk3IiByPSIyMi40MzQiLz48L2c+PHBhdGggZD0ibTkzLjcxNCAyNjAuMzk3YzAtOC4zMDIgNC41MTQtMTUuNTQ2IDExLjIxNy0xOS40MjUtMy4zMDEtMS45MS03LjEyOS0zLjAwOS0xMS4yMTctMy4wMDktMTIuMzkgMC0yMi40MzQgMTAuMDQ0LTIyLjQzNCAyMi40MzRzMTAuMDQ0IDIyLjQzNCAyMi40MzQgMjIuNDM0YzQuMDg4IDAgNy45MTctMS4wOTkgMTEuMjE3LTMuMDA5LTYuNzA0LTMuODc5LTExLjIxNy0xMS4xMjMtMTEuMjE3LTE5LjQyNXoiIGZpbGw9IiNiMWRiZmMiLz48cGF0aCBkPSJtMTY2LjE3NCAyNjAuMzk3YzAtOC4zMDIgNC41MTQtMTUuNTQ2IDExLjIxNy0xOS40MjUtMy4zMDEtMS45MS03LjEyOS0zLjAwOS0xMS4yMTctMy4wMDktMTIuMzkgMC0yMi40MzQgMTAuMDQ0LTIyLjQzNCAyMi40MzRzMTAuMDQ0IDIyLjQzNCAyMi40MzQgMjIuNDM0YzQuMDg4IDAgNy45MTYtMS4wOTkgMTEuMjE3LTMuMDA5LTYuNzA0LTMuODc5LTExLjIxNy0xMS4xMjMtMTEuMjE3LTE5LjQyNXoiIGZpbGw9IiNiMWRiZmMiLz48cGF0aCBkPSJtMjM4LjYzMyAyNjAuMzk3YzAtOC4zMDIgNC41MTQtMTUuNTQ2IDExLjIxNy0xOS40MjUtMy4zMDEtMS45MS03LjEzLTMuMDA5LTExLjIxNy0zLjAwOS0xMi4zOSAwLTIyLjQzNCAxMC4wNDQtMjIuNDM0IDIyLjQzNHMxMC4wNDQgMjIuNDM0IDIyLjQzNCAyMi40MzRjNC4wODggMCA3LjkxNy0xLjA5OSAxMS4yMTctMy4wMDktNi43MDMtMy44NzktMTEuMjE3LTExLjEyMy0xMS4yMTctMTkuNDI1eiIgZmlsbD0iI2IxZGJmYyIvPjxwYXRoIGQ9Im0zMTEuMDkzIDI2MC4zOTdjMC04LjMwMiA0LjUxMy0xNS41NDYgMTEuMjE3LTE5LjQyNS0zLjMwMS0xLjkxLTcuMTMtMy4wMDktMTEuMjE3LTMuMDA5LTEyLjM5IDAtMjIuNDM0IDEwLjA0NC0yMi40MzQgMjIuNDM0czEwLjA0NCAyMi40MzQgMjIuNDM0IDIyLjQzNGM0LjA4OCAwIDcuOTE3LTEuMDk5IDExLjIxNy0zLjAwOS02LjcwNC0zLjg3OS0xMS4yMTctMTEuMTIzLTExLjIxNy0xOS40MjV6IiBmaWxsPSIjYjFkYmZjIi8+PC9zdmc+';
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
      app.input.validate('#thread-img')) {
      db.collection('threads').add({
        user: firebase.auth().currentUser.uid,
        title: createThreadForm['title'].value,
        description: createThreadForm['description'].value,
        created: firebase.firestore.FieldValue.serverTimestamp()
      }).then(doc => {
        uploadImage('threads/', '#thread-img-upload', doc.id);
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
    const addCommentForm = document.querySelector('#add-comment-form');

    if (app.input.validate('#description') &&
      app.input.validate('#comment-img')) {
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
                <img id="${doc.id}-img" class="float-left" width="40" height="40"/>
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
    content: '<div class="page-content login-screen-content"> <form class="list" id="add-comment-form"> <div class="list" id="dialog-list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea id="description" name="description" placeholder="Write your comment here" required validate></textarea> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> <input type="file" id="comment-img-upload" required validate> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button" id="add-comment" href="#">Submit</a>  <a class="button" id="cancel-comment" href="#">Cancel</a></div> </form> </div>',
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