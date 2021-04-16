var $$ = Dom7;

var app = new Framework7({
  root: '#app', // App root element
  name: 'framework7-core-tab-view', // App name
  theme: 'auto', // Automatic theme detection

  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Create Popups with swipe to close
const loginSwipeToClosePopup = app.popup.create({
  el: '.login-popup',
  swipeToClose: true,
});

const registerSwipeToClosePopup = app.popup.create({
  el: '.register-popup',
  swipeToClose: true,
});

const newThreadSwipeToClosePopup = app.popup.create({
  el: '.new-thread-popup',
  swipeToClose: true,
});

$$(document).on("click", ".new-thread-dialog", function () {
  app.dialog.create({
    content: ' <div class="page-content login-screen-content"> <div class="block-title">New Topic</div> <form class="list"> <div class="list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <input type="text" name="title" placeholder="Thread Title" /> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea name="description" placeholder="Description"></textarea> </div> </div> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button create-thread-dialog" href="#">Create Thread</a> <a class="button create-thread-dialog" href="#">Cancel</a> </div> </form> </div>',
    cssClass: 'dialog'
  }).open();
});

// Create Dialogs 
// Open/close
$$(document).on("click", ".create-thread-dialog", function () {
  app.dialog.close();
});

$$(document).on("click", ".new-comment-dialog", function () {
  app.dialog.create({
    content: '<div class="page-content login-screen-content"> <form class="list"> <div class="list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea name="description" placeholder="Write your comment here"></textarea> </div> </div> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button popup-close submit-comment-dialog" href="#">Submit</a>  <a class="button submit-comment-dialog" href="#">Cancel</a></div> </form> </div>',
    cssClass: 'dialog'
  }).open();
});

$$(document).on("click", ".submit-comment-dialog", function () {
  app.dialog.close();
});

// Confirm
$$(document).on("click", ".delete-thread-dialog", function () {
  app.dialog.confirm(' Are you sure you want to delete the thread?', '', function () {
    app.dialog.alert('Thread Deleted', '');
  });
});

$$(document).on("click", ".delete-comment-dialog", function () {
  app.dialog.confirm(' Are you sure you want to delete the comment?', '', function () {
    app.dialog.alert('Comment Deleted', '');
  });
});