const express = require("express");
const router = express.Router();
const Users = require("../users/userDb");
const Posts = require("../posts/postDb");
const checkFor = require("./checkForMw.js");

//! POST REQUEST -- ADDS A NEW USER =================================
router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error adding the User",
      });
    });
});
//! POST REQUEST -- ADDS A NEW POST TO A SINGLE USER ==================
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };
  Posts.insert(postInfo)
    .then((post) => {
      res.status(210).json(post);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error adding the Post for the User",
      });
    });
});
//! GET REQUEST -- GETS ALL USERS ================================
router.get("/", (req, res) => {
  Users.get(req.query)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the Users Posts",
      });
    });
});
//! GET REQUEST -- GETS A USER BY A CERTAIN ID =======================
router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the User",
      });
    });
});
//! GET REQUEST -- GETS A USERS POSTS BY THEIR ID ======================
router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error getting the Posts for the User",
      });
    });
});
//! DELETE REQUEST -- NUKES A USER ====================================
router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then((deleted) => {
      res.status(200).json(deleted);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error removing the User",
      });
    });
});
//! PUT REQUEST -- CAN EDIT A USERS INFO ===============================
router.put("/:id", validateUserId, (req, res) => {
  Users.update(req.params.id, req.body.name)
    .then(() => {
      Users.getById(req.params.id).then((user) => {
        res.status(200).json(user);
      });
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error updating the User",
      });
    });
});
//! ===================================================================

//! CUSTOM MIDDLEWARE =================================================

function validateUserId(req, res, next) {
  Users.getById(req.params.id).then((user) => {
    if (user) {
      next();
    } else {
      res.status(400).json({ errorMessage: "That User Id does not exist" });
    }
  });
}

function validateUser(req, res, next) {
  if (Object.entries(req.body).length > 0) {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({
        message: "Name is required!!",
      });
    }
  } else {
    res.status(400).json({ message: "Missing vital data" });
  }
}

function validatePost(req, res, next) {
  if (Object.entries(req.body).length > 0) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ message: "Missing text field" });
    }
  } else {
    res.status(400).json({ message: "Missing the post data" });
  }
}

module.exports = router;
