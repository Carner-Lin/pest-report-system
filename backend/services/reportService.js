const db = require("../db");

// Custom service errors let controllers return HTTP responses without mixing SQL logic into routes.
class ReportServiceError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = "ReportServiceError";
        this.statusCode = statusCode;
    }
}

const reportFieldsSql = `
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
`;

function runQuery(sql, params) {
    return new Promise((resolve, reject) => {
        const callback = (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        };

        if (Array.isArray(params)) {
            db.query(sql, params, callback);
            return;
        }

        db.query(sql, callback);
    });
}

function attachStage(error, stage) {
    error.stage = stage;
    return error;
}

function formatReportCoordinates(report) {
    return {
        ...report,
        latitude: report.latitude !== null ? Number(report.latitude) : null,
        longitude: report.longitude !== null ? Number(report.longitude) : null,
    };
}

function formatReportList(results) {
    return results.map(formatReportCoordinates);
}

async function getAllReports() {
    const sql = `
        ${reportFieldsSql}
        ORDER BY report_date DESC
    `;

    const results = await runQuery(sql);
    return formatReportList(results);
}

async function getReportsByUser(userId) {
    const sql = `
        ${reportFieldsSql}
        WHERE pest_reports.user_id = ?
        ORDER BY report_date DESC
    `;

    const results = await runQuery(sql, [userId]);
    return formatReportList(results);
}

async function getNotedReports(userId) {
    const sql = `
        SELECT
            pest_reports.*,
            pests.name AS pest_name,
            pests.organism_type,
            pests.regulatory_status,
            pests.notifiable,
            pests.description AS pest_description,
            users.username
        FROM user_noted_reports
                 INNER JOIN pest_reports ON user_noted_reports.report_id = pest_reports.id
                 LEFT JOIN pests ON pest_reports.pest_id = pests.id
                 LEFT JOIN users ON pest_reports.user_id = users.id
        WHERE user_noted_reports.user_id = ?
        ORDER BY user_noted_reports.created_at DESC
    `;

    const results = await runQuery(sql, [userId]);
    return formatReportList(results);
}

async function createReport(reportData) {
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

    return runQuery(sql, [
        reportData.user_id || null,
        reportData.pest_id || null,
        reportData.custom_pest_name || null,
        reportData.pest_type || null,
        reportData.description || null,
        reportData.location_name || null,
        reportData.latitude || null,
        reportData.longitude || null,
        reportData.image_url,
        reportData.status_choice || "Uncertain",
        reportData.notifiable_choice || "Uncertain",
    ]);
}

async function noteReport(reportId, userId) {
    const sql = `
        INSERT INTO user_noted_reports (user_id, report_id)
        VALUES (?, ?)
    `;

    try {
        return await runQuery(sql, [userId, reportId]);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new ReportServiceError(409, "Report already noted.");
        }

        throw error;
    }
}

async function removeNotedReport(reportId, userId) {
    const sql = `
        DELETE FROM user_noted_reports
        WHERE user_id = ? AND report_id = ?
    `;

    const result = await runQuery(sql, [userId, reportId]);

    if (result.affectedRows === 0) {
        throw new ReportServiceError(404, "Noted report not found.");
    }

    return result;
}

async function deleteReportWithPermission(reportId, currentUserId) {
    const checkUserSql = "SELECT id, role FROM users WHERE id = ?";
    const checkReportSql = "SELECT id, user_id FROM pest_reports WHERE id = ?";
    const deleteSql = "DELETE FROM pest_reports WHERE id = ?";

    let userResults;
    try {
        userResults = await runQuery(checkUserSql, [currentUserId]);
    } catch (error) {
        throw attachStage(error, "checkUser");
    }

    if (userResults.length === 0) {
        throw new ReportServiceError(404, "User not found.");
    }

    let reportResults;
    try {
        reportResults = await runQuery(checkReportSql, [reportId]);
    } catch (error) {
        throw attachStage(error, "checkReport");
    }

    if (reportResults.length === 0) {
        throw new ReportServiceError(404, "Report not found.");
    }

    const currentUser = userResults[0];
    const report = reportResults[0];
    const isAdmin = currentUser.role === "admin";
    const isOwner = Number(report.user_id) === Number(currentUserId);

    if (!isAdmin && !isOwner) {
        throw new ReportServiceError(403, "You can only delete your own reports.");
    }

    let deleteResult;
    try {
        deleteResult = await runQuery(deleteSql, [reportId]);
    } catch (error) {
        throw attachStage(error, "deleteReport");
    }

    if (deleteResult.affectedRows === 0) {
        throw new ReportServiceError(404, "Report not found.");
    }

    return deleteResult;
}

module.exports = {
    ReportServiceError,
    createReport,
    deleteReportWithPermission,
    getAllReports,
    getNotedReports,
    getReportsByUser,
    noteReport,
    removeNotedReport,
};
