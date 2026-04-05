import { useEffect, useMemo, useState } from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";

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

    const validSelectedLocation = useMemo(() => {
        if (
            !selectedReport ||
            selectedReport.latitude == null ||
            selectedReport.longitude == null
        ) {
            return null;
        }

        return {
            lat: Number(selectedReport.latitude),
            lng: Number(selectedReport.longitude),
        };
    }, [selectedReport]);

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
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedReport(null)}
                >
                    <div
                        className="report-detail-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="report-detail-header-bar">
                            <h2>Report Details</h2>
                            <button
                                type="button"
                                className="close-btn"
                                onClick={() => setSelectedReport(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="report-detail-body">
                            <div className="report-detail-top">
                                <div className="report-detail-left">
                                    <h3 className="report-detail-pest-title">
                                        {getDisplayPestName(selectedReport)}
                                    </h3>

                                    <div className="report-meta-row">
                                        <p>
                                            <strong>Uploaded by:</strong>{" "}
                                            {getDisplayUsername(selectedReport)}
                                        </p>
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {getDisplayDate(selectedReport)}
                                        </p>
                                    </div>

                                    <p>
                                        <strong>Pest type:</strong>{" "}
                                        {selectedReport.organism_type || "Unknown"}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {selectedReport.regulatory_status || "Unknown"}
                                    </p>

                                    <p>
                                        <strong>Notifiable:</strong>{" "}
                                        {selectedReport.notifiable ? "Yes" : "No"}
                                    </p>

                                    <p>
                                        <strong>Description:</strong>{" "}
                                        {selectedReport.description ||
                                            selectedReport.pest_description ||
                                            "No description"}
                                    </p>

                                    <p>
                                        <strong>Detailed location:</strong>{" "}
                                        {selectedReport.location_name || "Not provided"}
                                    </p>
                                </div>

                                <div className="report-detail-right">
                                    <div className="report-image-box">
                                        {selectedReport.image_url ? (
                                            <img
                                                src={selectedReport.image_url}
                                                alt={getDisplayPestName(selectedReport)}
                                                className="report-detail-image"
                                            />
                                        ) : (
                                            <div className="report-image-placeholder">
                                                No image uploaded
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="report-detail-map-section">
                                <h4>Reported Location</h4>

                                {validSelectedLocation ? (
                                    <div
                                        className="report-detail-map-wrapper"
                                        onWheel={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Map
                                            defaultCenter={validSelectedLocation}
                                            defaultZoom={13}
                                            gestureHandling="greedy"
                                            style={{ width: "100%", height: "320px" }}
                                        >
                                            <Marker position={validSelectedLocation} />
                                        </Map>
                                    </div>
                                ) : (
                                    <p>No map location available for this report.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default PestReports;