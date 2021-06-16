const userResolvers = require("../Resolvers/users");
const messageResolvers = require("../Resolvers/messages");

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
};
