const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/default.json");

module.exports = (context) => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
      context.user = decodedToken;
    });

    return context;
  }
};
