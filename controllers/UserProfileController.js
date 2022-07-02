const User = require("../models/User");
const CustomError = require("../errors");

const StatusCodes = require("http-status-codes");
const { userTokenPayload, createJWT } = require("../utils/jwt");
const { findByIdAndUpdate } = require("../models/User");
const createUser = async (req, res) => {
  const { phoneNumber } = req.body;
  const UserExists = await User.findOne({ phoneNumber });
  if (UserExists) {
    // throw new CustomError.BadRequestError("This phone Number already exists!");
    await User.findOneAndDelete({ phoneNumber });
  } else {
    const user = await User.create(req.body);
    const tokenPayload = userTokenPayload(user);
    const token = createJWT({ payload: tokenPayload });
    res.status(StatusCodes.CREATED).json({ user: user, token: token });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  // { username: 1, phoneNumber: 1, about: 1 }

  res.status(200).json(users);
};
const getUser = async (req, res) => {
  const user = await User.findById(req.body.recipient);

  res.status(200).json(user);
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId);

  res.status(200).json(user);
};
const updateUser = async (req, res) => {
  const user = await User.findById(req.user.userId);
  await user.updateOne(req.body);
  await user.save();

  res.status(200).json(user);
};
module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  getCurrentUser,
};
