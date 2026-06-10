import { useEffect, useMemo, useState } from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";
import {
    getDisplayPestName,
    getDisplayUsername,
    getDisplayDate,
    getDisplayType,
    getDisplayStatus,
    getDisplayNotifiable,
    getValidSelectedLocation,
} from "../utils/reportHelpers";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// This modal shows the full details of a selected report.
export default function ReportDetailModal({
                                              report,
                                              onClose,
                                              isAdmin = false,
                                              onDelete,
                                          }) {
    const [isNoted, setIsNoted] = useState(false);
    const [noteLoading, setNoteLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const validSelectedLocation = useMemo(() => {
        return getValidSelectedLocation(report);
    }, [report]);

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    useEffect(() => {
        if (!currentUser?.id || !report?.id) {
            setIsNoted(false);
            return;
        }

        fetch(`${API_BASE_URL}/api/reports/noted/${currentUser.id}`)
            .then((res) => res.json())
            .then((data) => {
                const alreadyNoted = Array.isArray(data)
                    ? data.some((item) => Number(item.id) === Number(report.id))
                    : false;

                setIsNoted(alreadyNoted);
            })
            .catch((err) => {
                console.error("Error checking noted reports:", err);
                setIsNoted(false);
            });
    }, [currentUser, report]);

    if (!report) return null;

    const displayType = getDisplayType(report);
    const displayStatus = getDisplayStatus(report);
    const displayNotifiable = getDisplayNotifiable(report);

    const handleToggleNote = async () => {
        if (!currentUser?.id) {
            alert("Please login first.");
            return;
        }

        setNoteLoading(true);

        try {
            if (!isNoted) {
                const res = await fetch(
                    `${API_BASE_URL}/api/reports/${report.id}/note`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: currentUser.id,
                        }),
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    alert(data.error || "Failed to note report.");
                    setNoteLoading(false);
                    return;
                }

                setIsNoted(true);
            } else {
                const res = await fetch(
                    `${API_BASE_URL}/api/reports/${report.id}/note/${currentUser.id}`,
                    {
                        method: "DELETE",
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    alert(data.error || "Failed to remove noted report.");
                    setNoteLoading(false);
                    return;
                }

                setIsNoted(false);
            }
        } catch (error) {
            console.error("Toggle note error:", error);
            alert("Server error.");
        } finally {
            setNoteLoading(false);
        }
    };

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
                            <div className="report-title-row">
                                <h3 className="report-detail-pest-title">
                                    {getDisplayPestName(report)}
                                </h3>

                                <button
                                    type="button"
                                    className={`report-note-btn compact-note-btn ${isNoted ? "noted" : ""}`}
                                    onClick={handleToggleNote}
                                    disabled={noteLoading}
                                >
                                    {noteLoading
                                        ? "Loading..."
                                        : isNoted
                                            ? "Remove Note"
                                            : "Noted"}
                                </button>
                            </div>

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
                                    style={{ width: "100%", height: "260px" }}
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