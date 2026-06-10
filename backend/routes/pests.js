const express = require("express");
const router = express.Router();
const db = require("../db");

// This route provides pest reference data for the frontend encyclopedia and form.

// GET /api/pests
// Return all pests stored in the database.
router.get("/", (req, res) => {
    db.query("SELECT * FROM pests", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;