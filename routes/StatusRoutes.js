const express = require("express");
const {
  createImageStatus,
  getMyStatuses,
  getFriendsStatuses,
} = require("../controllers/StatusController");
const router = express.Router();
const { createTypedStatus } = require("../controllers/StatusController");
const AuthenticateUser = require("../middlewares/authenticationMiddleware");
router.route("/createTyped").post(AuthenticateUser, createTypedStatus);

router.route("/createImaged").post(AuthenticateUser, createImageStatus);

router.route("/getMyStatuses").get(AuthenticateUser, getMyStatuses);
router.route("/getFriendsStatuses").get(AuthenticateUser, getFriendsStatuses);
module.exports = router;
