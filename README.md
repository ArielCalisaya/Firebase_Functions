# Firebase_Functions

firebase structure for social media project on firestore api cloud

## This api will be used in my social media project
### Schema of API:

```json

users = {
  email: "calisayaariel62@gmail.com",
  handle: "Ariel_C",
  imageUrl: "https://firebasestorage.googleapis.com/v0/b/social.appspot.com/o/image.png?alt=media",
  bio: "Software Developer",
  website: "http://ArielCalisaya.github.io",
  localtion: "santiago, CL",
}

comments: [
    {
      userHandle: "user",
      body: "New coment",
      createdAt: "2020-01-29T05:01:48.909Z",
      id: "elpl1rw2y1nm3mxnzy4",
      liedCount: 5,
      commentCount: 3,
      userInComments: [
        {
          userHandle: "Ariel_C",
          body: "You're welcome",
          createdAt: "2020-02-12T05:02:08.909Z"
          commentId: "elpl1rw2y1nm3mxnzy4"
        }
        {
          userHandle: "Ariel_C",
          body: "Cool",
          createdAt: "2020-02-12T05:01:58.909Z"
          commentId: "elpl1rw2y1nm3mxnzy4"
        },
        
      ]
    }
  ]
};


userDetails = {
  credentials: {
    userId: "123891239",
    email: "calisayaariel62@gmail.com",
    handle: "Ariel_C",
    createdAt: "2020-02-03T23:38:46.189Z",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/social.appspot.com/o/image.png?alt=media",
    bio: "Software Developer",
    website: "http://ArielCalisaya.github.io",
    localtion: "santiago, CL"

  likes: [
    {
      userHandle: "Randy Marsh",
      screamId: "86d9429ko0124560m"
    },
    {
      userHandle: "Jhonny Mcfly",
      screamId: "d19423219ko012pw9"
    }
  ]
  }
}
```
