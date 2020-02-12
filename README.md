# Firebase_Functions

firebase structure for firestore api cloud

### this api will be used in my social media project
#### Schema of API

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
      body: "comment from db js",
      createdAt: "2020-01-29T05:01:48.909Z",
      liedCount: 5,
      commentCount: 3
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
      userHandle: "Jhonny Lopes",
      screamId: "d19423219ko012pw9"
    }
  ]
  }
}
```
