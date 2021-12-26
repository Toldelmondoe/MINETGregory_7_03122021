const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/commentCtrl");
const auth = require('../middleware/auth'); 

router.get("/", auth.verifyToken, commentCtrl.findAllComments);
router.get("/:Messageid", auth.verifyToken, commentCtrl.findOneComment);
router.post("/", auth.verifyToken, commentCtrl.createComment);
router.delete("/", auth.verifyCommentRight, commentCtrl.deleteComment);

module.exports = router;