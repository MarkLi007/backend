const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userAddr: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  }],
  likes: {
    type: Number,
    default: 0,
  },
  reports: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
