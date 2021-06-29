const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/default.json");
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();

module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }

  context.pubsub = pubsub; // now we dont need to instantiate every time for different resolver
  return context;
};
