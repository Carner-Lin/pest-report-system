const express = require("express");
const router = express.Router();
const db = require("../db");

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
            longitude: report.longitude !== null ? Number(report.longitude) : null
        }));

        res.json(formattedResults);
    });
});

// POST /api/reports
router.post("/", (req, res) => {
    const {
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
    } = req.body;

    if (!pest_id && !custom_pest_name) {
        return res.status(400).json({ error: "Pest required" });
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
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Report submitted" });
        }
    );
});

// DELETE /api/reports/:id
router.delete("/:id", (req, res) => {
    const reportId = req.params.id;
    const { currentUserId } = req.body;

    if (!currentUserId) {
        return res.status(400).json({ error: "Current user ID is required." });
    }

    const checkAdminSql = "SELECT role FROM users WHERE id = ?";

    db.query(checkAdminSql, [currentUserId], (checkErr, checkResults) => {
        if (checkErr) {
            console.error("Check admin error:", checkErr);
            return res.status(500).json({ error: "Database error." });
        }

        if (checkResults.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const currentUser = checkResults[0];

        if (currentUser.role !== "admin") {
            return res.status(403).json({ error: "Only admin can delete reports." });
        }

        const deleteSql = "DELETE FROM pest_reports WHERE id = ?";

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

module.exports = router;