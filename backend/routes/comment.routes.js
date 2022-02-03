const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authJwt = require('../middleware/authJwt'); 
const multer = require("../middleware/multer-config");

router.get("/", commentController.findAllComments);
router.get("/:id", commentController.findOneComment);
router.get("/users/:id", commentController.findAllCommentsForOne);
router.post("/", multer, commentController.createComment);
router.put("/:id", multer, commentController.modifyComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router; 