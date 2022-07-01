const express = require("express");
const {
  createMessage,
  getAllMessages,

  getSingleChat,
  AllMessages,
  getAllChats,
} = require("../controllers/MessagesController");
const AuthenticateUser = require("../middlewares/authenticationMiddleware");

const router = express.Router();

router.route("/createMessage").post(AuthenticateUser, createMessage);

router.route("/getChats").get(AuthenticateUser, getAllMessages);
router.route("/all").get(AuthenticateUser, AllMessages);

router.route("/singleChat").post(AuthenticateUser, getSingleChat);

router.route("/allChats").get(AuthenticateUser, getAllChats);

module.exports = router;
