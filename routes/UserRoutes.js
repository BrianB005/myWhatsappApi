const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
} = require("../controllers/UserProfileController");
const AuthenticateUser = require("../middlewares/authenticationMiddleware");
const router = express.Router();

router.route("/createUser").post(createUser);
router.route("/allUsers").get(getAllUsers);
router.route("/getUser").post(AuthenticateUser, getUser);
router.route("/updateUser").put(AuthenticateUser, updateUser);

module.exports = router;
