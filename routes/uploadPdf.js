const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const parsePdf = require("../parsePdf");
const fs = require("fs");
const { Sequelize, Op } = require("sequelize");

// 设置 multer 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 上传 PDF 文件并解析
router.post("/", upload.single("pdfFile"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const text = await parsePdf(filePath);

    // 这里假设您想要存储解析后的文本，可以将其保存到数据库
    const newPdfRecord = await PdfModel.create({
      filePath,
      text,
    });

    res.status(200).json({ message: "PDF uploaded and parsed", text });
  } catch (error) {
    console.error("Error during file upload and parsing:", error);
    res.status(500).json({ error: "Error uploading and parsing PDF" });
  }
});

module.exports = router;
