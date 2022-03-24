const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authJwt = require('../middleware/authJwt'); 

router.get("/", commentController.findAllComments);
router.get("/:id", commentController.findOneComment);
router.get("/post/:id", commentController.findCommentsByPost);
router.get("/users/:id", commentController.findAllCommentsForOne);
router.post("/", authJwt.verifyCommentRight, commentController.createComment);
router.put("/:id", authJwt.verifyCommentRight, commentController.modifyComment);
router.delete("/:id", authJwt.verifyCommentRight, commentController.deleteComment);

module.exports = router; 