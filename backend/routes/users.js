const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db");


  // POST /api/users/register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email, and password are required."
            });
        }

        const checkUserSql = "SELECT id FROM users WHERE email = ?";
        db.query(checkUserSql, [email], async (checkErr, checkResults) => {
            if (checkErr) {
                console.error("Check user error:", checkErr);
                return res.status(500).json({ error: "Database error." });
            }

            if (checkResults.length > 0) {
                return res.status(409).json({ error: "Email already exists." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertSql = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
      `;

            db.query(insertSql, [username, email, hashedPassword], (insertErr, result) => {
                if (insertErr) {
                    console.error("Register error:", insertErr);
                    return res.status(500).json({ error: "Registration failed." });
                }

                res.status(201).json({
                    message: "User registered successfully.",
                    userId: result.insertId
                });
            });
        });
    } catch (error) {
        console.error("Register server error:", error);
        res.status(500).json({ error: "Server error." });
    }
});


//  POST /api/users/login
router.post("/login", (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required."
            });
        }

        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, results) => {
            if (err) {
                console.error("Login error:", err);
                return res.status(500).json({ error: "Database error." });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            res.json({
                message: "Login successful.",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch (error) {
        console.error("Login server error:", error);
        res.status(500).json({ error: "Server error." });
    }
});


//  GET /api/users
router.get("/", (req, res) => {
    const sql = "SELECT id, username, email, created_at FROM users ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Get users error:", err);
            return res.status(500).json({ error: "Failed to fetch users." });
        }

        res.json(results);
    });
});

module.exports = router;