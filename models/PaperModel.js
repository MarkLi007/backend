// paper-backend/models/PaperModel.js
const mongoose = require("mongoose");

const PaperSchema = new mongoose.Schema({
  paperId: { type: Number, index: true },
  title: String,
  author: String,
  paperAbstract: String,
  ipfsHash: String,
  timestamp: Number,
  exist: { type: Boolean, default: true },
  versions: [
    {
      ipfsHash: String,
      timestamp: Number,
      signature: String
    }
  ]
});

// 导出一个 PaperModel
module.exports = mongoose.model("Paper", PaperSchema);
