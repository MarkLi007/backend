// routes/comment.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
/**
 * commentsData 结构示例：
 * {
 *   "paperId1": [
 *     { id: 1, userAddr: "0x123...", content: "Great paper!", createdAt: 1683621887 },
 *     { id: 2, userAddr: "0xABC...", content: "Needs more references", createdAt: 1683622000 }
 *   ],
 *   "paperId2": [ ... ]
 * }
 */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",  
  password: "123456",  
  database: "paper_system"  
});
const commentsData = {};

// 自动生成 commentId 用来区分同一 paper 中的不同评论
let globalCommentId = 1;

/**
 * GET /api/comments?paperId=xxx
 * 返回此paperId下的所有评论
 */
router.get("/comments", (req, res) => {
  const { paperId } = req.query;
  if(!paperId) {
    return res.status(400).json({ error: "Missing paperId" });
  }
  const list = commentsData[paperId] || [];
  return res.json(list);
});

/**
 * POST /api/comments
 * body: { paperId, userAddr, content }
 */
router.post("/comments", (req, res) => {
  const { paperId, userAddr, content } = req.body;
  if(!paperId || !userAddr || !content){
    return res.status(400).json({ error: "Missing fields" });
  }

  const newComment = {
    id: globalCommentId++,
    userAddr,
    content,
    createdAt: Math.floor(Date.now()/1000)
  };
  if(!commentsData[paperId]){
    commentsData[paperId] = [];
  }
  commentsData[paperId].push(newComment);
  return res.json(newComment);
});

module.exports = router;
