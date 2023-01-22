const { Schema, model, mongoose } = require("mongoose");

const replySchema = new Schema({
  replyText: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  username: {
    type: String,
    required: true,
    ref: "Users",
  },
  replyImg: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reply = model("Reply", replySchema);

module.exports = Reply;