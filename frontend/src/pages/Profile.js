import { useEffect, useState } from "react";
import ReportDetailModal from "../components/ReportDetailModal";
import defaultAvatar from "../assets/default-avatar.png";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getDisplayPestName(report) {
    return report.pest_name || report.custom_pest_name || "Unknown Pest";
}

function getDisplayDate(report) {
    if (!report.report_date) return "Unknown date";

    return new Date(report.report_date).toLocaleDateString("en-NZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function Profile() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    const [myReports, setMyReports] = useState([]);
    const [notedReports, setNotedReports] = useState([]);
    const [loadingMyReports, setLoadingMyReports] = useState(true);
    const [loadingNotedReports, setLoadingNotedReports] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        if (!currentUser?.id) return;

        fetch(`${API_BASE_URL}/api/reports/user/${currentUser.id}`)
            .then((res) => res.json())
            .then((data) => {
                setMyReports(data);
                setLoadingMyReports(false);
            })
            .catch((err) => {
                console.error("Error fetching my reports:", err);
                setLoadingMyReports(false);
            });

        fetch(`${API_BASE_URL}/api/reports/noted/${currentUser.id}`)
            .then((res) => res.json())
            .then((data) => {
                setNotedReports(data);
                setLoadingNotedReports(false);
            })
            .catch((err) => {
                console.error("Error fetching noted reports:", err);
                setLoadingNotedReports(false);
            });
    }, [currentUser]);

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

            setMyReports((prev) => prev.filter((report) => report.id !== reportId));
            setNotedReports((prev) => prev.filter((report) => report.id !== reportId));

            if (selectedReport?.id === reportId) {
                setSelectedReport(null);
            }

            alert("Report deleted successfully.");
        } catch (error) {
            console.error("Delete report error:", error);
            alert("Server error.");
        }
    };

    const handleRemoveNote = async (reportId) => {
        if (!currentUser?.id) {
            alert("Please login first.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to remove this noted report?"
        );

        if (!confirmed) return;

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/reports/${reportId}/note/${currentUser.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to remove note.");
                return;
            }

            setNotedReports((prev) => prev.filter((report) => report.id !== reportId));

            if (selectedReport?.id === reportId) {
                setSelectedReport(null);
            }

            alert("Note removed successfully.");
        } catch (error) {
            console.error("Remove note error:", error);
            alert("Server error.");
        }
    };

    if (!currentUser) {
        return (
            <main className="main-content">
                <div className="auth-card">
                    <h2>Profile</h2>
                    <p>No user is currently logged in.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content">
            <div className="profile-page-layout">
                <div className="profile-left-panel">
                    <h2>Profile</h2>

                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar-circle">
                            <img
                                src={defaultAvatar}
                                alt="Default avatar"
                                className="profile-avatar-image"
                            />
                        </div>
                    </div>

                    <div className="profile-info-block">
                        <p><strong>Username:</strong> {currentUser.username}</p>
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p><strong>User ID:</strong> {currentUser.id}</p>
                        <p><strong>Role:</strong> {currentUser.role || "user"}</p>
                    </div>
                </div>

                <div className="profile-right-panel">
                    <div className="profile-section-box">
                        <div className="profile-section-header">
                            <h3>My Reports</h3>
                        </div>

                        <div className="profile-section-body">
                            {loadingMyReports ? (
                                <p>Loading...</p>
                            ) : myReports.length === 0 ? (
                                <p>No reports posted yet.</p>
                            ) : (
                                <div className="profile-report-list">
                                    {myReports.map((report) => (
                                        <div key={report.id} className="profile-report-card">
                                            <div
                                                className="profile-report-card-content"
                                            >
                                                <h4>{getDisplayPestName(report)}</h4>
                                                <p><strong>Date:</strong> {getDisplayDate(report)}</p>
                                                <p><strong>Location:</strong> {report.location_name || "Unknown location"}</p>
                                            </div>

                                            <div className="profile-report-card-actions">
                                                <button
                                                    type="button"
                                                    className="profile-open-btn"
                                                    onClick={() => setSelectedReport(report)}
                                                >
                                                    View Detail
                                                </button>

                                                <button
                                                    type="button"
                                                    className="profile-delete-btn"
                                                    onClick={() => handleDeleteReport(report.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-section-box">
                        <div className="profile-section-header">
                            <h3>Noted Reports</h3>
                        </div>

                        <div className="profile-section-body">
                            {loadingNotedReports ? (
                                <p>Loading...</p>
                            ) : notedReports.length === 0 ? (
                                <p>No noted reports yet.</p>
                            ) : (
                                <div className="profile-report-list">
                                    {notedReports.map((report) => (
                                        <div key={report.id} className="profile-report-card">
                                            <div
                                                className="profile-report-card-content"
                                            >
                                                <h4>{getDisplayPestName(report)}</h4>
                                                <p><strong>Date:</strong> {getDisplayDate(report)}</p>
                                                <p><strong>Location:</strong> {report.location_name || "Unknown location"}</p>
                                            </div>

                                            <div className="profile-report-card-actions">
                                                <button
                                                    type="button"
                                                    className="profile-open-btn"
                                                    onClick={() => setSelectedReport(report)}
                                                >
                                                    View Detail
                                                </button>

                                                <button
                                                    type="button"
                                                    className="profile-remove-note-btn"
                                                    onClick={() => handleRemoveNote(report.id)}
                                                >
                                                    Remove Note
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    isAdmin={currentUser?.role === "admin"}
                    onDelete={handleDeleteReport}
                />
            )}
        </main>
    );
}

export default Profile;