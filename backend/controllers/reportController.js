const reportService = require("../services/reportService");

function buildImageUrl(file) {
    if (!file) return null;

    const backendBaseUrl =
        process.env.BACKEND_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    return `${backendBaseUrl}/uploads/${file.filename}`;
}

function sendServiceError(res, error, fallbackMessage, logLabel) {
    if (error instanceof reportService.ReportServiceError) {
        return res.status(error.statusCode).json({ error: error.message });
    }

    if (logLabel) {
        console.error(logLabel, error);
    }

    return res.status(500).json({ error: fallbackMessage });
}

function sendDeleteError(res, error) {
    if (error instanceof reportService.ReportServiceError) {
        return res.status(error.statusCode).json({ error: error.message });
    }

    if (error.stage === "checkUser") {
        console.error("Check user error:", error);
        return res.status(500).json({ error: "Database error." });
    }

    if (error.stage === "checkReport") {
        console.error("Check report error:", error);
        return res.status(500).json({ error: "Database error." });
    }

    console.error("Delete report error:", error);
    return res.status(500).json({ error: "Failed to delete report." });
}

async function getAllReports(req, res) {
    try {
        const reports = await reportService.getAllReports();
        res.json(reports);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getReportsByUser(req, res) {
    try {
        const reports = await reportService.getReportsByUser(req.params.userId);
        res.json(reports);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getNotedReports(req, res) {
    try {
        const reports = await reportService.getNotedReports(req.params.userId);
        res.json(reports);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function createReport(req, res) {
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

    const image_url = buildImageUrl(req.file);

    try {
        await reportService.createReport({
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
            notifiable_choice,
        });

        res.json({ message: "Report submitted", image_url });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function noteReport(req, res) {
    const { reportId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        await reportService.noteReport(reportId, userId);
        res.json({ message: "Report noted successfully." });
    } catch (error) {
        return sendServiceError(
            res,
            error,
            "Failed to note report.",
            "Note report error:"
        );
    }
}

async function removeNotedReport(req, res) {
    const { reportId, userId } = req.params;

    try {
        await reportService.removeNotedReport(reportId, userId);
        res.json({ message: "Noted report removed successfully." });
    } catch (error) {
        return sendServiceError(
            res,
            error,
            "Failed to remove noted report.",
            "Remove noted report error:"
        );
    }
}

async function deleteReport(req, res) {
    const reportId = req.params.id;
    const { currentUserId } = req.body;

    if (!currentUserId) {
        return res.status(400).json({ error: "Current user ID is required." });
    }

    try {
        await reportService.deleteReportWithPermission(reportId, currentUserId);
        res.json({ message: "Report deleted successfully." });
    } catch (error) {
        return sendDeleteError(res, error);
    }
}

module.exports = {
    createReport,
    deleteReport,
    getAllReports,
    getNotedReports,
    getReportsByUser,
    noteReport,
    removeNotedReport,
};
