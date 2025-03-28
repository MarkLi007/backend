// paper-backend/routes/paper.js
const express = require("express");
const router = express.Router();
const PaperModel = require("../models/PaperModel");

// [GET] /api/paper/search?keyword=xxx
router.get("/search", async (req, res) => {
  const keyword = req.query.keyword || "";
  let filter = {};
  if (keyword) {
    const regex = new RegExp(keyword, "i");
    filter = {
      $or: [
        { title: regex },
        { author: regex }
      ]
    };
  }
  try {
    const results = await PaperModel.find(filter).limit(50);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
