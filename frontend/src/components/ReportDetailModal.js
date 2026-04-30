import { useEffect, useMemo } from "react";
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

export default function ReportDetailModal({ report, onClose, isAdmin, onDelete }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const validSelectedLocation = useMemo(() => {
        if (!report || report.latitude == null || report.longitude == null) {
            return null;
        }

        return {
            lat: Number(report.latitude),
            lng: Number(report.longitude),
        };
    }, [report]);

    if (!report) return null;

    const displayType =
        report.pest_type || report.organism_type || "Unknown";

    const displayStatus =
        report.status_choice || report.regulatory_status || "Unknown";

    const displayNotifiable =
        report.notifiable_choice ||
        (report.notifiable === 1 ||
        report.notifiable === "1" ||
        report.notifiable === true
            ? "Yes"
            : report.notifiable === 0 ||
            report.notifiable === "0" ||
            report.notifiable === false
                ? "No"
                : "Unknown");

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="report-detail-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="report-detail-header-bar">
                    <h2>Report Details</h2>
                    <button type="button" className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="report-detail-body">
                    <div className="report-detail-top">
                        <div className="report-detail-left">
                            <h3 className="report-detail-pest-title">
                                {getDisplayPestName(report)}
                            </h3>

                            <div className="report-meta-row">
                                <p>
                                    <strong>Uploaded by:</strong> {getDisplayUsername(report)}
                                </p>
                                <p>
                                    <strong>Date:</strong> {getDisplayDate(report)}
                                </p>
                            </div>

                            <p>
                                <strong>Pest type:</strong> {displayType}
                            </p>

                            <p>
                                <strong>Status:</strong> {displayStatus}
                            </p>

                            <p>
                                <strong>Notifiable:</strong> {displayNotifiable}
                            </p>

                            <p>
                                <strong>Description:</strong>{" "}
                                {report.description ||
                                    report.pest_description ||
                                    "No description"}
                            </p>

                            <p>
                                <strong>Detailed location:</strong>{" "}
                                {report.location_name || "Not provided"}
                            </p>
                        </div>

                        <div className="report-detail-right">
                            <div className="report-image-box">
                                {report.image_url ? (
                                    <img
                                        src={report.image_url}
                                        alt={getDisplayPestName(report)}
                                        className="report-detail-image"
                                    />
                                ) : (
                                    <div className="report-image-placeholder">
                                        No image uploaded
                                    </div>
                                )}
                            </div>

                            {isAdmin && (
                                <button
                                    type="button"
                                    className="report-delete-btn"
                                    onClick={() => onDelete && onDelete(report.id)}
                                >
                                    Delete Report
                                </button>
                            )}
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
                                    style={{ width: "100%", height: "380px" }}
                                >
                                    <Marker position={validSelectedLocation} />
                                </Map>
                            </div>
                        ) : (
                            <p>No valid location available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}