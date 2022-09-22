const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: "Hey there!Iam using Whatsapp",
    },
    profilePic: {
      type: String,
      default: "icon.png",
    },
    chats: {
      type: Array,
      default: [],
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
