const Status = require("../models/Status");

const moment = require("moment");
const createTypedStatus = async (req, res) => {
  req.body.sender = req.user.userId;

  const typedStatus = await Status.create(req.body);

  res.status(200).json(typedStatus);
};
const createImageStatus = async (req, res) => {
  req.body.sender = req.user.userId;

  const imageStatus = await Status.create(req.body);

  res.status(200).json(imageStatus);
};

const getMyStatuses = async (req, res) => {
  const myStatuses = await Status.find({ sender: req.user.userId }).populate(
    "sender",
    { _id: 1, phoneNumber: 1, profilePic: 1 }
  );

  res.status(200).json(myStatuses);
};

const getMyLastStatus = async (req, res) => {
  const myLastStatus = await Status.find({ sender: req.user.userId })
    .sort("-createdAt")
    .limit(1)
    .populate("sender", { _id: 1, phoneNumber: 1, profilePic: 1 });

  res.status(200).json(myLastStatus);
};

const getFriendsStatuses = async (req, res) => {
  const savedContactsIds = req.body.contacts;
  const allStatuses = await Promise.all(
    savedContactsIds.map((contactId) => {
      const status = Status.find({ sender: contactId })
        .sort("-createdAt")
        .limit(1)
        .populate("sender", { _id: 1, phoneNumber: 1, profilePic: 1 })
        .then((data) => data[0]);
      return status;
    })
  );

  const commonStatuses = allStatuses.filter((status) =>
    status?.targetAudience.includes(req.user.userId)
  );

  res.status(200).json(commonStatuses);
};

const getAllStatuses = async (req, res) => {
  const statuses = await Status.find({});

  res.status(200).json(statuses);
};

const deleteStatus = async (req, res) => {
  await Status.findByIdAndDelete(req.params.statusId);
  res.status(200).json("Status deleted!");
};

const getAContactStatuses = async (req, res) => {
  const contactStatuses = await Status.find({ sender: req.params.contactId })
    .sort("createdAt")
    .populate("sender", { _id: 1, phoneNumber: 1, profilePic: 1 });

  // contactStatuses.forEach((status) => {
  // const momentsAgo = moment(status.createdAt).fromNow();
  // console.log(momentsAgo);
  // const timeCreated = new Date(status.createdAt).toLocaleTimeString();
  // console.log(timeCreated);
  // });

  res.status(200).json(contactStatuses);
};

const viewStatus = async (req, res) => {
  const viewedStatus = await Status.findById(req.params.statusId);

  await viewedStatus.updateOne({
    $addToSet: { viewers: req.user.userId },
  });

  res.status(200).json(viewedStatus);
};

const getAStatusViewers = async (req, res) => {
  const status = await Status.findById(req.params.statusId);

  res.status(200).json(status);
};
module.exports = {
  createTypedStatus,
  createImageStatus,
  getMyStatuses,
  getFriendsStatuses,
  getAllStatuses,
  getAContactStatuses,
  deleteStatus,
  viewStatus,
  getAStatusViewers,
  getMyLastStatus,
};
