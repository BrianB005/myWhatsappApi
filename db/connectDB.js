const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.connect(url);
};

const Pusher = require("pusher");

const pusher = new Pusher({
  cluster: "mt1",
  appId: process.env.appId,
  secret: process.env.secret,
  key: process.env.key,
  useTLS: true,
});

const db = mongoose.connection;

db.once("open", () => {
  const messageCollection = db.collection("messages");
  const changeStream = messageCollection.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const message = change.fullDocument;
      // console.log(message.recipient.toString());
      pusher.trigger(message.sender.toString(), "inserted", message);
      pusher.trigger(message.recipient.toString(), "inserted", message);
    } else {
      console.log("Error triggering pusher event");
    }
  });
  const usersCollection = db.collection("users");
  const changeStream2 = usersCollection.watch();
  changeStream2.on("change", (change) => {
    if (change.operationType === "update") {
      const userId = change.documentKey._id;
      const updatedField = change.updateDescription.updatedFields;

      pusher.trigger(userId.toString(), "updated", updatedField);
    } else {
      console.log("Error triggering pusher event");
    }
  });
});

const pusherAuthenticateUser = (req, res) => {
  const socketId = req.body.socket_id;
  const user = { id: req.user.userId };
  const authResponse = pusher.authenticateUser(socketId, user);
  res.send(authResponse);
};
module.exports = { connectDB, pusherAuthenticateUser };
