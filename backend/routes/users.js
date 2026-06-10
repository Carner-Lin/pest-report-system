const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db");

// This route handles user registration, login, and basic user listing.

// POST /api/users/register
// Create a new user with a hashed password.
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Reject incomplete registration data.
        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email, and password are required."
            });
        }

        const checkUserSql = "SELECT id FROM users WHERE email = ?";

        // Check whether the email already exists.
        db.query(checkUserSql, [email], async (checkErr, checkResults) => {
            if (checkErr) {
                console.error("Check user error:", checkErr);
                return res.status(500).json({ error: "Database error." });
            }

            if (checkResults.length > 0) {
                return res.status(409).json({ error: "Email already exists." });
            }

            // Hash the password before storing it in the database.
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

// POST /api/users/login
// Verify credentials and return a safe user object for the frontend.
router.post("/login", (req, res) => {
    try {
        const { email, password } = req.body;

        // Reject incomplete login data.
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required."
            });
        }

        const sql = "SELECT * FROM users WHERE email = ?";

        // Load the user by email and compare the password hash.
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

            // Return only the fields needed by the frontend.
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

// GET /api/users
// Return a simple user list without password hashes.
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