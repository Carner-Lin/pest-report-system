const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const reportController = require("../controllers/reportController");

// This route file only wires report endpoints to middleware and controllers.
const router = express.Router();

// Create the uploads directory if it does not already exist.
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Save uploaded report images to the local uploads folder.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

router.get("/", reportController.getAllReports);
router.get("/user/:userId", reportController.getReportsByUser);
router.get("/noted/:userId", reportController.getNotedReports);
router.post("/", upload.single("image"), reportController.createReport);
router.post("/:reportId/note", reportController.noteReport);
router.delete("/:reportId/note/:userId", reportController.removeNotedReport);
router.delete("/:id", reportController.deleteReport);

module.exports = router;
