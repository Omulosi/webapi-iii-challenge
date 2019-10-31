const express = require('express');

const router = express.Router();

const User = require('./userDb');
const Post = require('../posts/postDb');

const dummy_users = [
  { id: 1, name: 'Shaun' },
  { id: 2, name: 'Megan' },
  { id: 3, name: 'Pere' },
];

router.post('/', validateUser, (req, res) => {
  User.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "Error adding user: " + error.message})
    })
});

router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
  const post = {...req.body, user_id: req.user.id};

  Post.insert(post)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      res.status(500).json({message: `Error adding post: ${error.message}`})
    })
});

router.get('/', (req, res) => {

  res.status(200).json(dummy_users);

  User.get()
    .then(users => {
      if (users) {
        res.status(200).json(users);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: 'Error retrieving users'})
    });

});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  User.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({message: "Error getting user posts: " + error.message})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.user.id)
    .then(() => {
      res.status(200).json({message: "User has been removed"})
    })
    .catch(error => {
      res.status(500).json({
        message: `Error removing user: ${error.message}`
      })
    })
});

router.put('/:id', [validateUserId, validateUser], (req, res) => {
  User.update(req.user.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => {
      res.status(500).json({
        message: `Error updating the user: ${error.message}`
      })
    })

});

//custom middleware

function validateUserId(req, res, next) {
  const { id } =  req.params;

  User.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({message: 'Invalid user id'});
      }
    })

}

function validateUser(req, res, next) {
  if (Object.keys(req.body).length) {
    if ("name" in req.body && req.body.name) {
      next()
    } else {
      res.status(400).json({message: "missing or empty required name field"});
    }
  } else {
    res.status(400).json({message: "missing user data"})
  }

}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length) {
    if ("text" in req.body && req.body.text) {
      next()
    } else {
      res.status(400).json({message: "missing or empty required text field"});
    }
  } else {
    res.status(400).json({message: "missing post data"})
  }

}

module.exports = router;
