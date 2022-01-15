const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  body: String,
  created_at: Date,
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

module.exports = mongoose.model("Comment", CommentSchema);
