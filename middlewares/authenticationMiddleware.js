const { isTokenValid } = require("../utils/jwt");
const CustomError = require("../errors");

const AuthenticateUser = async (req, res, next) => {
  const AuthorizationHeader = req.headers.authorization;

  if (!AuthorizationHeader || !AuthorizationHeader.startsWith("Bearer")) {
    throw new CustomError.UnauthenticatedError("Invalid authentication");
  } else {
    const token = AuthorizationHeader.split(" ")[1];
    try {
      const { username, userId, phoneNumber } = isTokenValid({ token });
      req.user = { username, userId, phoneNumber };
      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError("Wrong authentication token");
    }
  }
};

module.exports = AuthenticateUser;
