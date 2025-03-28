// routes/diff.js
const express = require("express");
const { diffText } = require("../diffService");

const router = express.Router();

/**
 * In-memory 存储版本文本:
 * versionsData[paperId][versionIndex] = { text: "...", createdAt: Date.now() }
 *
 * 在真正的项目中, 你应使用数据库存储.
 */
const versionsData = {};

/**
 * 提交(或保存)某论文某版本文本
 * POST /api/version
 * body: { paperId, versionIndex, text }
 */
router.post("/version", (req, res) => {
  const { paperId, versionIndex, text } = req.body;
  if(!paperId || versionIndex===undefined || !text){
    return res.status(400).json({error:"Missing required fields"});
  }
  if(!versionsData[paperId]){
    versionsData[paperId] = {};
  }
  versionsData[paperId][versionIndex] = {
    text,
    createdAt: Date.now(),
  };
  return res.json({ success: true });
});

/**
 * 获取对比结果
 * GET /api/diff?paperId=xxx&verA=0&verB=1
 */
router.get("/diff", (req, res) => {
  const { paperId, verA, verB } = req.query;
  if(!paperId || verA===undefined || verB===undefined){
    return res.status(400).json({error:"Missing query params"});
  }
  // 检查是否有对应的文本
  const versionA = versionsData[paperId]?.[verA];
  const versionB = versionsData[paperId]?.[verB];
  if(!versionA || !versionB){
    return res.status(404).json({error:"One or both versions not found"});
  }

  const result = diffText(versionA.text, versionB.text);
  res.json({
    paperId,
    verA,
    verB,
    diff: result,
  });
});

module.exports = router;
