const express = require("express");
const router = express.Router();
const authJwt = require('../middleware/authJwt'); 
const controller = require("../controllers/user.controller");

router.get("/", controller.AllAccess);
router.get("/user", controller.userBoard);
router.get("/mod", controller.moderatorBoard);
router.get("/admin", controller.adminBoard);

module.exports = router; 