// parsePdf.js
const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * @param {string} filePath 服务器本地文件路径
 * @returns {Promise<string>} 解析出的纯文本
 */
async function parsePdfFile(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text; // 返回PDF的纯文本
}

module.exports = {
  parsePdfFile,
};
