const { Schema, model } = require("mongoose");

const reactionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
  },
});

const Reaction = model("Reaction", reactionSchema);

module.exports = Reaction;
