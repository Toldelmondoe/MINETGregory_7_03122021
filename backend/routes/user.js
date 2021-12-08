const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authCtrl');

router.post('/signup', authCtrl.signup); // la route signup utilisera le contôleur signup
router.post('/login', authCtrl.login); // la route post utilisera le contrôleur post

module.exports = router;