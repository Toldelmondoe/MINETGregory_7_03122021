const express = require("express");
const router = express.Router();
const verifySignUp = require("../middleware/verifySignUp");
const controller = require("../controllers/auth.controller");

router.post('/signup', [
    verifySignUp.checkDuplicateUsernameOrEmail, 
    verifySignUp.checkRolesExisted
  ],
  controller.signup
); 
router.post('/signin', controller.signin); 

module.exports = router; 