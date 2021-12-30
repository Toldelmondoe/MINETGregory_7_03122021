const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require('../middleware/authJwt'); 
const multer = require("../middleware/multer-config");

router.get("/", postController .findAllPosts);
router.get("/:postId", postController .findOnePost);
router.get("/", postController .findAllPostsForOne);
router.post("/", multer, authJwt.verifyToken, postController .createPost);
router.delete("/:postId", [
    authJwt.verifyToken, 
    authJwt.verifyPostRight, 
    authJwt.verifyHaveRight, 
    authJwt.isModeratorOrAdmin
  ], 
  postController.deletePost
);

module.exports = router; 




