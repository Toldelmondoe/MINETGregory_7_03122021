const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authJwt = require('../middleware/authJwt'); 
const multer = require("../middleware/multer-config");
const verifySignUp = require("../middleware/verifySignUp");

router.get("/posts/:id", commentController.findAllComments);
router.get("/:id", commentController.findOneComment);
router.post("/", multer, commentController.createComment);
router.put("/:id", multer, commentController.modifyComment);
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