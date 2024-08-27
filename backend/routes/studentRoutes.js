const express = require("express");
const multer = require("multer");
const {
  uploadMarks,
  generateReportCard,
} = require("../controllers/studentController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Ensure 'uploads/' directory exists

router.post("/upload-marks", upload.single("file"), uploadMarks);
router.get("/generate-report-cards", generateReportCard);

module.exports = router;
