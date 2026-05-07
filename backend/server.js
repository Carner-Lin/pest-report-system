require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pestRoutes = require("./routes/pests");
const reportRoutes = require("./routes/reports");
const userRoutes = require("./routes/users");
const aiRoutes = require("./routes/ai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working" });
});

app.use("/api/pests", pestRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});