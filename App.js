const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const { pusherAuthenticateUser, connectDB } = require("./db/connectDB");

const app = express();

const userRouter = require("./routes/UserRoutes");
const messagesRouter = require("./routes/MessageRoutes");

// middleware for handlin errors
const ErrorHandlerMiddleware = require("./middlewares/error_handler_middleware");
app.use(cors());
app.use(express.json());

// setting up multer for file uploads
const multer = require("multer");
const path = require("path");
const AuthenticateUser = require("./middlewares/authenticationMiddleware");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body);
  },
});

const upload = multer({ storage });

app.post("/api/v1/upload", upload.single("image"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});

// path for static files

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messagesRouter);

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
