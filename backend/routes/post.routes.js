const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require('../middleware/authJwt'); 
const multer = require("../middleware/multer-config");

router.get("/", postController.findAllPosts);
router.get("/:id", postController.findOnePost);
router.get("/users/:id", postController.findAllPostsForOne);
router.post("/", multer, authJwt.verifyPostRight ,postController.createPost);
router.put("/:id", multer, authJwt.verifyPostRight, postController.modifyPost);
router.delete("/:id", authJwt.verifyPostRight,postController.deletePost);

module.exports = router; 




