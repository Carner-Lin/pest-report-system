const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* Create uploads directory if it does not exist */
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/* Store uploaded report images on the server */
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

// GET /api/reports
router.get("/", (req, res) => {
    const sql = `
        SELECT
            pest_reports.*,
            pests.name AS pest_name,
            pests.organism_type,
            pests.regulatory_status,
            pests.notifiable,
            pests.description AS pest_description,
            users.username
        FROM pest_reports
                 LEFT JOIN pests ON pest_reports.pest_id = pests.id
                 LEFT JOIN users ON pest_reports.user_id = users.id
        ORDER BY report_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);

        const formattedResults = results.map((report) => ({
            ...report,
            latitude: report.latitude !== null ? Number(report.latitude) : null,
            longitude: report.longitude !== null ? Number(report.longitude) : null,
        }));

        res.json(formattedResults);
    });
});

// GET /api/reports/user/:userId
router.get("/user/:userId", (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT
            pest_reports.*,
            pests.name AS pest_name,
            pests.organism_type,
            pests.regulatory_status,
            pests.notifiable,
            pests.description AS pest_description,
            users.username
        FROM pest_reports
                 LEFT JOIN pests ON pest_reports.pest_id = pests.id
                 LEFT JOIN users ON pest_reports.user_id = users.id
        WHERE pest_reports.user_id = ?
        ORDER BY report_date DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);

        const formattedResults = results.map((report) => ({
            ...report,
            latitude: report.latitude !== null ? Number(report.latitude) : null,
            longitude: report.longitude !== null ? Number(report.longitude) : null,
        }));

        res.json(formattedResults);
    });
});

// GET /api/reports/noted/:userId
router.get("/noted/:userId", (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT
            pest_reports.*,
            pests.name AS pest_name,
            pests.organism_type,
            pests.regulatory_status,
            pests.notifiable,
            pests.description AS pest_description,
            users.username
        FROM user_noted_reports
                 INNER JOIN pest_reports ON user_noted_reports.report_id = pest_reports.id
                 LEFT JOIN pests ON pest_reports.pest_id = pests.id
                 LEFT JOIN users ON pest_reports.user_id = users.id
        WHERE user_noted_reports.user_id = ?
        ORDER BY user_noted_reports.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);

        const formattedResults = results.map((report) => ({
            ...report,
            latitude: report.latitude !== null ? Number(report.latitude) : null,
            longitude: report.longitude !== null ? Number(report.longitude) : null,
        }));

        res.json(formattedResults);
    });
});

// POST /api/reports
router.post("/", upload.single("image"), (req, res) => {
    const {
        user_id,
        pest_id,
        custom_pest_name,
        pest_type,
        description,
        location_name,
        latitude,
        longitude,
        status_choice,
        notifiable_choice,
    } = req.body;

    if (!pest_id && !custom_pest_name) {
        return res.status(400).json({ error: "Pest required" });
    }

    let image_url = null;

    if (req.file) {
        const backendBaseUrl =
            process.env.BACKEND_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        image_url = `${backendBaseUrl}/uploads/${req.file.filename}`;
    }

    const sql = `
        INSERT INTO pest_reports
        (
            user_id,
            pest_id,
            custom_pest_name,
            pest_type,
            description,
            location_name,
            latitude,
            longitude,
            image_url,
            status_choice,
            notifiable_choice
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id || null,
            pest_id || null,
            custom_pest_name || null,
            pest_type || null,
            description || null,
            location_name || null,
            latitude || null,
            longitude || null,
            image_url,
            status_choice || "Uncertain",
            notifiable_choice || "Uncertain",
        ],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Report submitted", image_url });
        }
    );
});

// POST /api/reports/:reportId/note
router.post("/:reportId/note", (req, res) => {
    const { reportId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    const sql = `
        INSERT INTO user_noted_reports (user_id, report_id)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, reportId], (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error: "Report already noted." });
            }
            console.error("Note report error:", err);
            return res.status(500).json({ error: "Failed to note report." });
        }

        res.json({ message: "Report noted successfully." });
    });
});

// DELETE /api/reports/:reportId/note/:userId
router.delete("/:reportId/note/:userId", (req, res) => {
    const { reportId, userId } = req.params;

    const sql = `
        DELETE FROM user_noted_reports
        WHERE user_id = ? AND report_id = ?
    `;

    db.query(sql, [userId, reportId], (err, result) => {
        if (err) {
            console.error("Remove noted report error:", err);
            return res.status(500).json({ error: "Failed to remove noted report." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Noted report not found." });
        }

        res.json({ message: "Noted report removed successfully." });
    });
});

// DELETE /api/reports/:id
router.delete("/:id", (req, res) => {
    const reportId = req.params.id;
    const { currentUserId } = req.body;

    if (!currentUserId) {
        return res.status(400).json({ error: "Current user ID is required." });
    }

    const checkUserSql = "SELECT id, role FROM users WHERE id = ?";
    const checkReportSql = "SELECT id, user_id FROM pest_reports WHERE id = ?";
    const deleteSql = "DELETE FROM pest_reports WHERE id = ?";

    db.query(checkUserSql, [currentUserId], (userErr, userResults) => {
        if (userErr) {
            console.error("Check user error:", userErr);
            return res.status(500).json({ error: "Database error." });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const currentUser = userResults[0];

        db.query(checkReportSql, [reportId], (reportErr, reportResults) => {
            if (reportErr) {
                console.error("Check report error:", reportErr);
                return res.status(500).json({ error: "Database error." });
            }

            if (reportResults.length === 0) {
                return res.status(404).json({ error: "Report not found." });
            }

            const report = reportResults[0];
            const isAdmin = currentUser.role === "admin";
            const isOwner = Number(report.user_id) === Number(currentUserId);

            if (!isAdmin && !isOwner) {
                return res.status(403).json({ error: "You can only delete your own reports." });
            }

            db.query(deleteSql, [reportId], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error("Delete report error:", deleteErr);
                    return res.status(500).json({ error: "Failed to delete report." });
                }

                if (deleteResult.affectedRows === 0) {
                    return res.status(404).json({ error: "Report not found." });
                }

                res.json({ message: "Report deleted successfully." });
            });
        });
    });
});

module.exports = router;