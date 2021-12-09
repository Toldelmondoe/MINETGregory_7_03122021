const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/userCtrl");
const auth = require('../middleware/auth'); 
const multer = require("../middleware/multer-config");

router.get("/:id", auth, userCtrl.getUserProfile);
router.patch("/update", auth, multer, userCtrl.updateUserProfile);
router.put("/update", auth, userCtrl.updatePassword);
router.delete("/:id", auth, userCtrl.deleteProfile);

module.exports = router;