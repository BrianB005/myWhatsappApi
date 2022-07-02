const Message = require("../models/Message");
const User = require("../models/User");

const createMessage = async (req, res) => {
  try {
    req.body.sender = req.user.userId;
    const message = await Message.create(req.body);
    const currentUser = await User.findById(req.user.userId);
    const recipientId = req.body.recipient;

    const recipient = await User.findById(recipientId);
    // console.log(recipient);

    // // const messageId = message._id;
    await currentUser.updateOne({
      $addToSet: { chats: recipientId },
    });

    await recipient.updateOne({
      $addToSet: { chats: req.user.userId },
    });

    res.status(200).json( message );
  } catch (error) {
    res.status(500).json("Error" + error);
  }
};

const AllMessages = async (req, res) => {
  const allMessages = await Message.find({
    $or: [
      {
        $and: [{ recipient: req.body.recipient }, { sender: req.user.userId }],
      },
      {
        $and: [{ recipient: req.user.userId }, { sender: req.body.recipient }],
      },
    ],
  });
  // .populate("sender", { _id: 0, username: 1, phoneNumber: 1 })
  // .populate("recipient", { _id: 0, username: 1, phoneNumber: 1 });

  res.status(200).json({ allMessages });
};

const getAllMessages = async (req, res) => {
  console.log(req.user.userId);
  const allMessages = await Message.find({
    $or: [{ recipient: req.user.userId }, { sender: req.user.userId }],
  })
    .populate("sender", { _id: 0, username: 1, phoneNumber: 1 })
    .populate("recipient", { _id: 0, username: 1, phoneNumber: 1 });

  res.status(200).json({ allMessages });
};

const getSingleChat = async (req, res) => {
  const chatMessages = await Message.find({
    // $or: [
    //   {
    $and: [{ recipient: req.body.recipient }, { sender: req.user.userId }],
    // },
    // {
    // $and: [{ recipient: req.user.userId }, { sender: req.body.recipient }],
    // },
    // {},
    // ],
  }).sort("createdAt");

  res.status(200).json(chatMessages);
};

const getAllChats = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);

  let allChats = await Promise.all(
    currentUser.chats.map((chatPartner) => {
      const lastMessage = Message.find({
        $or: [
          {
            $and: [{ recipient: chatPartner }, { sender: req.user.userId }],
          },
          {
            $and: [{ recipient: req.user.userId }, { sender: chatPartner }],
          },
        ],
      })

        .sort("-createdAt")
        .limit(1)
        .then((data) => {
          data[0].recipient = chatPartner;

          return data[0];
        });
      return lastMessage;
    })
  );

  const messages = await Message.populate(allChats, {
    path: "recipient",
    select: { _id: 1, phoneNumber: 1, profilePic: 1 },
  });

  res.status(200).json(messages);
};

module.exports = {
  createMessage,
  getAllMessages,
  getSingleChat,
  AllMessages,
  getAllChats,
};
