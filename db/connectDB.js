const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.connect(url);
};

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1432042",
  key: "36b67a35099f920fa4e2",
  secret: "594f1f9a98970cfb9ff9",
  cluster: "mt1",
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
