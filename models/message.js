const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  content: {
    type: String,
    required:true
  },
  from: {
    type: String,
    required:true
  },
  to: {
    type: String,
    required:true
  },
  createdAt: {
    type: String,
  },
});

const Message = model("Message", messageSchema);

module.exports = Message;
