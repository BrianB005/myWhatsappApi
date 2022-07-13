const express = require("express");
const {
  createImageStatus,
  getMyStatuses,
  getFriendsStatuses,
  getAllStatuses,
  getAContactStatuses,
  deleteStatus,
  getMyLastStatus,
  viewStatus,
  getAStatusViewers,
} = require("../controllers/StatusController");
const router = express.Router();
const { createTypedStatus } = require("../controllers/StatusController");
const AuthenticateUser = require("../middlewares/authenticationMiddleware");
router.route("/createTyped").post(AuthenticateUser, createTypedStatus);

router.route("/createImaged").post(AuthenticateUser, createImageStatus);

router.route("/getMyStatuses").get(AuthenticateUser, getMyStatuses);

router.route("/getMyStatuses/last").get(AuthenticateUser, getMyLastStatus);

router.route("/getFriendsStatuses").post(AuthenticateUser, getFriendsStatuses);
router.route("/deleteStatus/:statusId").delete(AuthenticateUser, deleteStatus);
router.route("/all").get(getAllStatuses);

router.route("/viewStatus/:statusId").put(AuthenticateUser, viewStatus);

router.route("/getViewers/:statusId").get(AuthenticateUser, getAStatusViewers);
router
  .route("/contactStatuses/:contactId")
  .get(AuthenticateUser, getAContactStatuses);

module.exports = router;
