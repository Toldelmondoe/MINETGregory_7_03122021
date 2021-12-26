const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageCtrl = require('../controllers/messageCtrl');
const multer = require('../middleware/multer-config');

router.post("/", auth.verifyToken, multer, messageCtrl.createMessage);
router.get("/all/:id", auth.verifyToken, messageCtrl.findAllMessagesForOne);
router.get("/:id", auth.verifyToken, messageCtrl.findOneMessage);
router.get("/", auth.verifyToken, messageCtrl.findAllMessages);
router.delete("/", auth.verifyMessageRight, messageCtrl.deleteMessage);

module.exports = router;