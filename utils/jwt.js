const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const userTokenPayload = (user) => {
  return {
    username: user.username,

    userId: user._id,
    phoneNumber: user.phoneNumber,
  };
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);
module.exports = { createJWT, isTokenValid, userTokenPayload };
