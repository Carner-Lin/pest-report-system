import { useEffect, useState } from "react";
import ReportDetailModal from "../components/ReportDetailModal";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getDisplayPestName(report) {
    return report.pest_name || report.custom_pest_name || "Unknown Pest";
}

function getDisplayUsername(report) {
    return report.username || "Anonymous User";
}

function getDisplayDate(report) {
    if (!report.report_date) return "Unknown date";

    return new Date(report.report_date).toLocaleDateString("en-NZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getCityLevelLocation(locationName) {
    if (!locationName) return "Unknown city";

    const parts = locationName
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length >= 2) {
        return parts[parts.length - 2];
    }

    return locationName;
}

function PestReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const isAdmin = currentUser?.role === "admin";

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/reports`)
            .then((res) => res.json())
            .then((data) => {
                setReports(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching reports:", err);
                setLoading(false);
            });
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
            const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentUserId: currentUser.id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to delete report.");
                return;
            }

            setReports((prev) => prev.filter((report) => report.id !== reportId));

            if (selectedReport?.id === reportId) {
                setSelectedReport(null);
            }

            alert("Report deleted successfully.");
        } catch (error) {
            console.error("Delete report error:", error);
            alert("Server error.");
        }
    };

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
                    isAdmin={isAdmin}
                    onDelete={handleDeleteReport}
                />
            )}
        </main>
    );
}

export default PestReports;