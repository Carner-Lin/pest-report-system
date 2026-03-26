const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/reports
router.get("/", (req, res) => {
    const sql = `
    SELECT pest_reports.*, pests.name AS pest_name
    FROM pest_reports
    LEFT JOIN pests ON pest_reports.pest_id = pests.id
    ORDER BY report_date DESC
  `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST /api/report
router.post("/", (req, res) => {
    const {
        user_id,
        pest_id,
        custom_pest_name,
        description,
        location_name,
        latitude,
        longitude,
        image_url
    } = req.body;

    if (!pest_id && !custom_pest_name) {
        return res.status(400).json({ error: "Pest required" });
    }

    const sql = `
    INSERT INTO pest_reports
    (user_id, pest_id, custom_pest_name, description, location_name, latitude, longitude, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(sql,
        [user_id, pest_id, custom_pest_name, description, location_name, latitude, longitude, image_url],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Report submitted" });
        }
    );
});

module.exports = router;