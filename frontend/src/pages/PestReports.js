import { useEffect, useState } from "react";
import ReportDetailModal from "../components/ReportDetailModal";

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

    useEffect(() => {
        fetch("http://localhost:5000/api/reports")
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
                />
            )}
        </main>
    );
}

export default PestReports;