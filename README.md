# Firebase_Functions

firebase structure for social media project with firestore api cloud

## This api will be used in my social media project
### Schema of API:

```json

user: {
  "email": "calisayaariel62@gmail.com",
  "handle": "Ariel_C",
  "imageUrl": "https://firebasestorage.googleapis.com/v0/b/social.appspot.com/o/image.png?alt=media",
  "bio": "Software Developer",
  "website": "http://ArielCalisaya.github.io",
  "localtion": "santiago, CL",
}

comments: [
    {
      "userHandle": "user",
      "body": "New coment",
      "createdAt": "2020-01-29T05:01:48.909Z",
      "id": "elpl1rw2y1nm3mxnzy4",
      "liedCount": 5,
      "commentCount": 3,
      "userInComments": [
        {
          "userHandle": "Ariel_C",
          "body": "You're welcome",
          "createdAt": "2020-02-12T05:02:08.909Z",
          "commentId": "elpl1rw2y1nm3mxnzy4"
        },
        {
          "userHandle": "Ariel_C",
          "body": "Cool",
          "createdAt": "2020-02-12T05:01:58.909Z",
          "commentId": "elpl1rw2y1nm3mxnzy4"
        }
        
      ]
    }
  ]
};


userDetails: {
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
            "read": false || true,
            "notificationsId": "dtE9qh0Hz271WRm4Z8tR"
        }
    ]
}
```
