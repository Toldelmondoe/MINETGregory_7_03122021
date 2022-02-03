const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require('../middleware/authJwt'); 
const multer = require("../middleware/multer-config");

router.get("/", postController.findAllPosts);
router.get("/:id", postController.findOnePost);
router.get("/users/:id", postController.findAllPostsForOne);
router.post("/", multer, postController.createPost);
router.put("/:id", multer, postController.modifyPost);
router.delete("/drop/:id", postController.deletePost);

module.exports = router; 




