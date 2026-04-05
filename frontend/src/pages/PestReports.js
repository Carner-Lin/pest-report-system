import { useEffect, useState } from "react";

function PestReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

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
                This page shows recently submitted pest reports, including pest type,
                location, description, and report date.
            </p>

            {loading ? (
                <p>Loading reports...</p>
            ) : reports.length === 0 ? (
                <p>No pest reports have been submitted yet.</p>
            ) : (
                <div className="reports-list">
                    {reports.map((report) => (
                        <div key={report.id} className="report-card">
                            <h3>
                                {report.pest_name ||
                                    report.custom_pest_name ||
                                    "Unknown pest"}
                            </h3>

                            <p>
                                <strong>Location:</strong>{" "}
                                {report.location_name || "Not provided"}
                            </p>

                            <p>
                                <strong>Description:</strong>{" "}
                                {report.description || "No description"}
                            </p>

                            <p>
                                <strong>Coordinates:</strong>{" "}
                                {report.latitude != null && report.longitude != null
                                    ? `${Number(report.latitude).toFixed(6)}, ${Number(
                                        report.longitude
                                    ).toFixed(6)}`
                                    : "Not provided"}
                            </p>

                            <p>
                                <strong>Reported on:</strong>{" "}
                                {report.report_date
                                    ? new Date(report.report_date).toLocaleString()
                                    : "Unknown date"}
                            </p>

                            {report.image_url && (
                                <img
                                    src={report.image_url}
                                    alt={report.pest_name || report.custom_pest_name || "Pest"}
                                    className="report-image"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default PestReports;