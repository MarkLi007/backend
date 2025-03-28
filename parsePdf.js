const fs = require("fs");
const pdfParse = require("pdf-parse");

const parsePdf = (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  return pdfParse(dataBuffer)
    .then((data) => data.text)
    .catch((error) => {
      console.error("Error parsing PDF:", error);
      throw new Error("Failed to parse PDF");
    });
};

module.exports = parsePdf;
