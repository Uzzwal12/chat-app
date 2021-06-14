const { AuthenticationError } = require("apollo-server");
const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../config/default.json").SECRET_KEY;

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authenticaton token must be `Bearer [token]");
  }
  throw new Error("Authorizaton token must be provided");
};
