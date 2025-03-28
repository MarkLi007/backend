const express = require("express");
const router = express.Router();
const Comment = require("../models/comment"); // 导入 Comment 模型

// 创建评论
router.post("/", async (req, res) => {
  const { userAddr, content, parentId } = req.body;

  try {
    const newComment = await Comment.create({
      userAddr,
      content,
      parentId,  // 如果是回复评论，parentId 会有值
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// 获取所有评论及其回复
router.get("/", async (req, res) => {
  try {
    // 查询所有评论及其回复
    const comments = await Comment.findAll({
      where: { parentId: null }, // 获取顶级评论
      include: [{
        model: Comment,
        as: 'replies',
        where: { parentId: sequelize.col('Comment.id') }, // 获取回复
        required: false
      }]
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// 点赞评论
router.post("/:id/like", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.likes += 1;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ error: "Failed to like comment" });
  }
});

// 举报评论
router.post("/:id/report", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.reports += 1;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error reporting comment:", error);
    res.status(500).json({ error: "Failed to report comment" });
  }
});

module.exports = router;
