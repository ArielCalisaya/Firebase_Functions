// example of a data base coments
let users = {
  email: "calisayaariel62@gmail.com",
  handle: "Ariel_C",
  imageUrl: "https://firebasestorage.googleapis.com/v0/b/social.appspot.com/o/image.png?alt=media",
  bio: "Software Developer",
  website: "http://ArielCalisaya.github.io",
  localtion: "santiago, CL",
}


let db = {
  comments: [
    {
      userHandle: "user",
      body: "comment from db js",
      createdAt: "2020-01-29T05:01:48.909Z",
      liedCount: 5,
      commentCount: 3
    }
  ]
};


let userDetails = {
  "credentials": {
    "website": "https://ArielCalisaya.github.io",
    "handle": "Ariel_C",
    "userId": "8rugbSeswkXHkqNsiQ8DW6JzNyt2",
    "email": "calisayaariel62@gmail.com",
    "bio": "Software Developer Junior",
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/social-media-d9c51.appspot.com/o/4485077.png?alt=media",
    "createdAt": "2020-02-03T23:38:46.189Z",
    "location": "Santiago, CL"
  },
  "likes": [
      {
          "userHandle": "Ariel_C",
          "commentId": "yyWlJNdwJoUI4YMYq3RJ"
      }
  ],
  "notifications": [
    {
        "recipient": "Ariel_C",
        "sender": "mommonkha",
        "createdAt": "2020-02-19T08:37:24.527Z",
        "commentId": "yyWlJNdwJoUI4YMYq3RJ",
        "type": "comment",
        "read": false,
        "notificationsId": "FOQn1ewdXnKuWGNEWIDU"
    },
    {
        "recipient": "Ariel_C",
        "sender": "mommonkha",
        "createdAt": "2020-02-19T08:20:47.596Z",
        "commentId": "yyWlJNdwJoUI4YMYq3RJ",
        "type": "like",
        "read": false,
        "notificationsId": "dtE9qh0Hz271WRm4Z8tR"
    }
  ]
},