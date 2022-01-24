const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require('../middleware/authJwt'); 
const multer = require("../middleware/multer-config");

router.get("/", postController.findAllPosts);
router.get("/:id", postController.findOnePost);
router.get("/all/:id", postController.findAllPostsForOne);
router.post("/", multer, authJwt.verifyToken, postController.createPost);
router.delete("/", 
  [
    authJwt.verifyToken, 
    authJwt.verifyPostRight, 
    authJwt.verifyHaveRight, 
    authJwt.isModeratorOrAdmin
  ], 
  postController.deletePost
);

module.exports = router; 




