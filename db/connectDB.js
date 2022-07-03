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
      pusher.trigger("messages", "inserted", message);
    } else {
      console.log("Error triggering pusher event");
    }
  });
});
module.exports = connectDB;
