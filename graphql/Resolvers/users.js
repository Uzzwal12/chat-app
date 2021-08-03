const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Message = require("../../models/message");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validations");
const checkAuth = require("../../utils/checkAuth");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("not authenticated");

        let users = await User.find(
          { username: { $ne: user.username } },
          { username: 1, createdAt: 1, imageUrl: 1, _id: 0 }
        );

        const allUserMessages = await Message.find({
          $or: [
            {
              from: user.username,
            },
            {
              to: user.username,
            },
          ],
        }).sort({ createdAt: 1 });

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (message) =>
              message.from === otherUser.username ||
              message.to === otherUser.username
          );

          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        throw new UserInputError("Invalid Username", {
          errors: {
            username: "Invalid Username",
          },
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new UserInputError("Invalid Password", {
          errors: {
            Password: "Invalid Password",
          },
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
  Mutation: {
    async register(_, { username, email, password, confirmPassword }) {
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({
        $or: [
          {
            email,
          },
          {
            username,
          },
        ],
      });

      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      return {
        ...res._doc,
        id: res._id,
      };
    },
  },
};
