import { useEffect, useState } from "react";
import defaultAvatar from "../assets/default-avatar.png";

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

    useEffect(() => {
        if (!currentUser?.id) return;

        fetch(`http://localhost:5000/api/reports/user/${currentUser.id}`)
            .then((res) => res.json())
            .then((data) => {
                setMyReports(data);
                setLoadingMyReports(false);
            })
            .catch((err) => {
                console.error("Error fetching my reports:", err);
                setLoadingMyReports(false);
            });

        fetch(`http://localhost:5000/api/reports/noted/${currentUser.id}`)
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
                                            <h4>{getDisplayPestName(report)}</h4>
                                            <p><strong>Date:</strong> {getDisplayDate(report)}</p>
                                            <p><strong>Location:</strong> {report.location_name || "Unknown location"}</p>
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
                                            <h4>{getDisplayPestName(report)}</h4>
                                            <p><strong>Date:</strong> {getDisplayDate(report)}</p>
                                            <p><strong>Location:</strong> {report.location_name || "Unknown location"}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Profile;