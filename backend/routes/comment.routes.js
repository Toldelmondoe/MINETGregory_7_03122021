const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authJwt = require('../middleware/authJwt'); 

router.get("/posts/:id", commentController.findAllComments);
router.get("/:id", commentController.findOneComment);
router.post("/", commentController.createComment);
router.put("/:id", commentController.modifyComment);
router.delete("/:id", 
  [
    authJwt.verifyToken, 
    authJwt.verifyCommentRight, 
    authJwt.verifyHaveRight, 
    authJwt.isModeratorOrAdmin
  ], 
  commentController.deleteComment
);

module.exports = router; 