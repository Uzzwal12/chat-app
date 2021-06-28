const {
  UserInputError,
  AuthenticationError,
  PubSub,
} = require("apollo-server");

const User = require("../../models/user");
const Message = require("../../models/message");
const checkAuth = require("../../utils/checkAuth");

const pubsub = new PubSub();

module.exports = {
  Query: {
    getMessages: async (_, { username }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Not Authenticated");
        const otherUser = await User.findOne({ username });
        if (!otherUser) throw new UserInputError("User not found");

        const usernames = [user.username, otherUser.username];

        const messages = await Message.find({
          from: { $in: usernames },
          to: { $in: usernames },
        }).sort({ createdAt: -1 });

        return messages;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { to, content }, context) => {
      try {
        const { user } = checkAuth(context);
        if (!user) throw new AuthenticationError("Not Authenticated");
        const recipient = await User.findOne({ username: to });

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient.username === user.username) {
          throw new UserInputError("Cannot message to yourself");
        }

        if (content.trim() === "") {
          throw new UserInputError("Cannot send empty message");
        }
        const message = await new Message({
          from: user.username,
          to,
          content,
          createdAt: new Date().toISOString(),
        });

        pubsub.publish("NEW_MESSAGE", { newMessage: message });
        return message.save();
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator(["NEW_MESSAGE"]),
    },
  },
};
