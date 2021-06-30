const {
  UserInputError,
  AuthenticationError,
  withFilter,
  ForbiddenError,
} = require("apollo-server");

const User = require("../../models/user");
const Message = require("../../models/message");
const checkAuth = require("../../utils/checkAuth");
const Reaction = require("../../models/Reaction");

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
    sendMessage: async (_, { to, content }, { pubsub, user }) => {
      try {
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

    reactToMessage: async (_, { id, content }, { user, pubsub }) => {
      const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
      try {
        if (!reactions.includes(content)) {
          throw new UserInputError("Invalid reaction");
        }

        const username = user ? user.username : "";
        user = await User.findOne({ username });
        if (!user) throw new AuthenticationError("Unauthneticated");

        let message = await Message.findOne({ _id: id });
        if (!message) throw new UserInputError("Message not found");

        if (message.from !== user.username && message.to !== user.username) {
          throw new ForbiddenError("Unauthorized");
        }

        let reaction = await Reaction.findOne({
          messageId: message.id,
          userId: user.id,
        });
        if (reaction) {
          reaction.content = content;
          await reaction.save();
        } else {
          reaction = await new Reaction({
            messageId: message.id,
            userId: user.id,
            content,
          });
        }
        pubsub.publish("NEW_REACTION", { newReaction: reaction });
        return reaction.save();
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator(["NEW_MESSAGE"]);
        },
        ({ newMessage }, _, { user }) => {
          console.log("newMessage", newMessage);
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }

          return false;
        }
      ),
    },
    newReaction: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator(["NEW_REACTION"]);
        },
        async ({ newReaction }, _, { user }) => {
          const message = await Message.findOne({ _id: newReaction.messageId });
          console.log("message", message);
          if (message.from === user.username || message.to === user.username) {
            return true;
          }

          return false;
        }
      ),
    },
  },
};
