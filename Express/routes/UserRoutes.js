const UserController = require("../controllers/UserController");
const express = require("express");
const router = express.Router();

router.post("/createuser", UserController.createUser);
router.post("/loginuser", UserController.userLogin);
router.get("/getuser", UserController.getuser);
router.post("/logout", UserController.logoutUser);
module.exports = router;
