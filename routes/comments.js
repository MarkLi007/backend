const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// 创建评论
router.post("/", async (req, res) => {
  const { userAddr, content, parentId } = req.body;

  try {
    const newComment = new Comment({
      userAddr,
      content,
      replies: parentId ? [parentId] : [],
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// 获取所有评论及其回复
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().populate("replies");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// 点赞评论
router.post("/:id/like", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.likes += 1;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to like comment" });
  }
});

// 举报评论
router.post("/:id/report", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.reports += 1;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to report comment" });
  }
});

module.exports = router;
