const mongoose = require("mongoose");

// message Schema

const MessageSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: [200, "Message is too long"],
    },
    sender: {
      type: mongoose.Types.ObjectId,
      required: [true, "Sender can't be empty"],
      ref: "User",
    },
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver can't be empty"],
    },
  },
  { timestamps: true }
);
MessageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model("Message", MessageSchema);
