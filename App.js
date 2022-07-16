const cors = require("cors");
require("dotenv").config();
require("express-async-errors");
const Status = require("./models/Status");
const express = require("express");
const User = require("./models/User");

const { pusherAuthenticateUser, connectDB } = require("./db/connectDB");

const app = express();

const userRouter = require("./routes/UserRoutes");
const messagesRouter = require("./routes/MessageRoutes");

const statusRouter = require("./routes/StatusRoutes");

// middleware for handlin errors
const ErrorHandlerMiddleware = require("./middlewares/error_handler_middleware");
app.use(cors());
app.use(express.json());

// setting up multer for file uploads
const multer = require("multer");
const path = require("path");
const AuthenticateUser = require("./middlewares/authenticationMiddleware");
const console = require("console");
const { log } = require("console");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];

    cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage });

app.post(
  "/api/v1/uploadProfile",
  upload.single("image"),
  AuthenticateUser,
  async (req, res) => {
    try {
      const currentUser = await User.findById(req.user.userId);

      await currentUser.updateOne({
        profilePic: req.file.filename,
      });
      await currentUser.save();

      return res.status(200).json(currentUser);
    } catch (error) {
      console.log(error);
    }
  }
);

app.post(
  "/api/v1/uploadStatus",
  upload.single("image"),
  AuthenticateUser,
  async (req, res) => {
    req.body.statusImage = req.file.filename;
    req.body.sender = req.user.userId;

    const uploadedStatus = await Status.create(req.body);
    // try {
    //   const imageStatus = Status.findById(req.params.statusId);
    //   await imageStatus.updateOne({
    //     statusImage: req.file.filename,
    //   });
    //   await imageStatus.save();
    //   return res.status(200).json("File uploaded successfully");
    // } catch (error) {
    //   console.log(error);
    // }

    return res.status(200).json(uploadedStatus);
  }
);

// path for static files

app.use(
  "/api/v1/images",
  express.static(path.join(__dirname, "public/images"))
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/statuses", statusRouter);

// pusher authentication
app.post("/api/v1/pusher/user-auth", AuthenticateUser, pusherAuthenticateUser);

// error handler middleware
app.use(ErrorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log("Server is currently running on port " + PORT);
    });
  } catch (error) {
    console.log("Error", error);
  }
};
start();
