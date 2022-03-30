const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const multer = require("../middleware/multer-config");

router.get("/", controller.AllAccess);
router.get("/user", controller.userBoard);
router.get("/mod", controller.moderatorBoard);
router.get("/admin", controller.adminBoard);
router.get("/:id", controller.findOneUser);
router.post("/:id", multer,controller.modifyUser);
router.delete("/:id", controller.deleteUser)

module.exports = router; 