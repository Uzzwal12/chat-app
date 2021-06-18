const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

const User = mongoose.model("User", userschema);

module.exports = User;
