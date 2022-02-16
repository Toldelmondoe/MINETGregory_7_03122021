const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authJwt = require('../middleware/authJwt'); 

router.get("/", commentController.findAllComments);
router.get("/:id", commentController.findOneComment);
router.get("/post/:id", commentController.findCommentsByPost);
router.get("/users/:id", commentController.findAllCommentsForOne);
router.post("/", commentController.createComment);
router.put("/:id", commentController.modifyComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router; 