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

module.exports = router;