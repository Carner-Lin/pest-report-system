import { useEffect, useState } from "react";
import ReportDetailModal from "../components/ReportDetailModal";
import {
    getDisplayPestName,
    getDisplayUsername,
    getDisplayDate,
    getCityLevelLocation,
} from "../utils/reportHelpers";
import {
    getReports,
    deleteReport,
} from "../services/api";

// This page displays all submitted pest reports.
function PestReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const isAdmin = currentUser?.role === "admin";

    useEffect(() => {
        const fetchAllReports = async () => {
            try {
                const data = await getReports();
                setReports(data);
            } catch (err) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllReports();
    }, []);

    const handleDeleteReport = async (reportId) => {
        if (!currentUser?.id) {
            alert("Please login first.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this report?"
        );

        if (!confirmed) return;

        try {
            await deleteReport(reportId, currentUser.id);

            setReports((prev) => prev.filter((report) => report.id !== reportId));

            if (selectedReport?.id === reportId) {
                setSelectedReport(null);
            }

            alert("Report deleted successfully.");
        } catch (error) {
            console.error("Delete report error:", error);
            alert(error.message || "Server error.");
        }
    };

    const canDeleteSelectedReport =
        !!selectedReport &&
        !!currentUser?.id &&
        (isAdmin || Number(selectedReport.user_id) === Number(currentUser.id));

    return (
        <main className="main-content">
            <h2>Pest Reports</h2>
            <p className="reports-desc">
                Browse recently submitted pest reports and open each card to view full
                report details.
            </p>

            {loading ? (
                <p>Loading reports...</p>
            ) : reports.length === 0 ? (
                <p>No pest reports have been submitted yet.</p>
            ) : (
                <div className="report-card-grid">
                    {reports.map((report) => (
                        <button
                            key={report.id}
                            type="button"
                            className="report-summary-card"
                            onClick={() => setSelectedReport(report)}
                        >
                            <h3 className="report-summary-title">
                                {getDisplayPestName(report)}
                            </h3>

                            <p>
                                <strong>Uploaded by:</strong> {getDisplayUsername(report)}
                            </p>

                            <p>
                                <strong>Date:</strong> {getDisplayDate(report)}
                            </p>

                            <p>
                                <strong>Area:</strong> {getCityLevelLocation(report.location_name)}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    canDelete={canDeleteSelectedReport}
                    onDelete={handleDeleteReport}
                />
            )}
        </main>
    );
}

export default PestReports;