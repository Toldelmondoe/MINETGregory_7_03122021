const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const messageCtrl = require('../controllers/messageCtrl');
const multer = require('../middlewares/multer-config');

router.post('/', auth, multer, messageCtrl.newMessage);
router.get('/', auth, messageCtrl.getAllMessages);
router.get('/:id', auth, messageCtrl.getOneMessage);
router.delete('/:id', auth, messageCtrl.deleteMessage);

module.exports = router;