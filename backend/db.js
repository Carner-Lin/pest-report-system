// backend/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1674249",
    database: "zl354"
});

db.connect(err => {
    if (err) {
        console.error("DB connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

module.exports = db;