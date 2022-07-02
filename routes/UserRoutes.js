const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/UserProfileController");
const AuthenticateUser = require("../middlewares/authenticationMiddleware");
const router = express.Router();

router.route("/createUser").post(createUser);
router.route("/allUsers").get(getAllUsers);
router.route("/getUser").post(getUser);

router.route("/getCurrrentUser").get(AuthenticateUser, getCurrentUser);
router.route("/updateUser").put(AuthenticateUser, updateUser);

module.exports = router;
