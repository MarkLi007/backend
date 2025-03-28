// server.js
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { parsePdfFile } = require("./parsePdf"); // 用于解析PDF文件
const diffRouter = require("./routes/diff");
const cors = require("cors");
const commentRouter = require("./routes/comment");
const mysql = require("mysql2");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL 数据库连接配置
const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "123456", 
  database: "paper_system"
});

// 文件上传中间件 (用于接收 PDF 文件)
const upload = multer({
  dest: path.join(__dirname, "uploads"),
  limits: { fileSize: 50 * 1024 * 1024 }, // 限制文件大小
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".pdf") {
      return cb(new Error("只能上传 PDF 文件"));
    }
    cb(null, true);
  }
});

// 存储 PDF 版本信息到数据库
async function storePdfVersion(paperId, version, filePath) {
  const dataBuffer = require("fs").readFileSync(filePath);
  const pdfData = await parsePdfFile(dataBuffer);
  const fileText = pdfData.text;

  const query = "INSERT INTO pdf_versions (paper_id, version, file_hash, file_text) VALUES (?, ?, ?, ?)";
  db.query(query, [paperId, version, filePath, fileText], (err, result) => {
    if (err) {
      console.error("Failed to store PDF version:", err);
    } else {
      console.log("PDF version stored successfully:", result);
    }
  });
}

// 上传PDF并生成新版本
app.post("/api/uploadPdf", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "没有上传文件" });
    }
    const { paperId, version } = req.body; // 需要传递 paperId 和 version

    // 存储版本信息
    await storePdfVersion(paperId, version, req.file.path);

    return res.json({ message: "文件上传成功，版本已生成" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "文件解析失败：" + err.message });
  }
});

// 版本信息查询
app.get("/api/getVersion", (req, res) => {
  const { paperId, version } = req.query;
  const query = "SELECT * FROM pdf_versions WHERE paper_id = ? AND version = ?";
  db.query(query, [paperId, version], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "查询失败：" + err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "版本未找到" });
    }
    return res.json(result[0]);
  });
});

// 启动服务器
const port = 3002;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
