const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authJwt = require('../middleware/authJwt'); 

router.get("/", commentController.findAllComments);
router.get("/:Postid", commentController.findOneComment);
router.post("/", authJwt.verifyToken, commentController.createComment);
router.delete("/", 
  [
    authJwt.verifyToken, 
    authJwt.verifyCommentRight, 
    authJwt.verifyHaveRight, 
    authJwt.isModeratorOrAdmin
  ], 
  commentController.deleteComment
);

module.exports = router; 