const mongoose = require("mongoose");

const ViewerSchema = mongoose.Schema(
  {
    viewer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const StatusSchema = mongoose.Schema(
  {
    sender: {
      required: [true, "please provide a user"],
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    isTyped: {
      type: Boolean,
      default: false,
    },
    font: {
      type: String,
    },
    backgroundColor: {
      type: String,
    },
    caption: {
      type: String,
      maxLength: [200, "Message can't be that long"],
    },
    statusImage: {
      type: String,
    },
    viewers: [ViewerSchema],
    targetAudience: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Status", StatusSchema);
