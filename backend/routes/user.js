const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require('../middleware/auth'); 

router.get("/all/", auth.verifyToken, userCtrl.findAllUsers)
router.get("/:id", auth.verifyToken, userCtrl.findOneUser)
router.delete("/", auth.verifyToken, userCtrl.deleteOneUser)
router.delete("/:id", auth.verifyToken, userCtrl.deleteMyAccount)

module.exports = router