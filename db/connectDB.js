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
      console.log(message);
      pusher.trigger("messages", "inserted", "Message created");
      pusher.sendTo(pusher.user, message);
      pusher.sendTo(message.recipient, message);
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
