const mongoose = require("mongoose");

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1432042",
  key: "36b67a35099f920fa4e2",
  secret: "594f1f9a98970cfb9ff9",
  cluster: "mt1",
  useTLS: true,
});

const connectDB = (url) => {
  mongoose.connect(url);
};

const db = mongoose.connection;

db.once("open", () => {
  const messagesCollection = db.collection("message");

  const changeStream = messagesCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType == "insert") {
      const message = change.fullDocument;
      pusher.trigger("messages", "inserted", message);
    } else {
      console.error("Ooops!Something went wrong");
    }
  });
});
module.exports = connectDB;
