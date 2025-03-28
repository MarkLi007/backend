const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const parsePdf = require("../parsePdf");
const fs = require("fs");

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
    
    // 解析完成后，您可以选择将解析结果存储在数据库中
    // await storePdfTextToDatabase(filePath, text); // 存储到数据库（需要实现该函数）

    res.status(200).json({ message: "PDF uploaded and parsed", text });
  } catch (error) {
    console.error("Error during file upload and parsing:", error);
    res.status(500).json({ error: "Error uploading and parsing PDF" });
  }
});

module.exports = router;
