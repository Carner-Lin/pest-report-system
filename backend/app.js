require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const pestRoutes = require("./routes/pests");
const reportRoutes = require("./routes/reports");
const userRoutes = require("./routes/users");
const aiRoutes = require("./routes/ai");

// This file creates the Express app and registers middleware and routes.
const app = express();

// Enable cross-origin access for the frontend.
app.use(cors());

// Parse JSON request bodies.
app.use(express.json());

// Serve uploaded report images as static files.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple health check route.
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working" });
});

// Register API route groups.
app.use("/api/pests", pestRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;