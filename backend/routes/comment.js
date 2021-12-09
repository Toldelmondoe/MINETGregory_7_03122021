const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/commentCtrl');

router.post('/', auth, commentCtrl.newComment);
router.get('/', auth, commentCtrl.getCommentsOfMessage);
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;