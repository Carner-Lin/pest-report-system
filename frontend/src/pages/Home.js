import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PestForm from "../components/PestForm";
import SearchResultsPanel from "../components/SearchResultsPanel";
import ReportDetailModal from "../components/ReportDetailModal";
import HomeMap from "../components/HomeMap";
import defaultReportImage from "../assets/default-report.png";
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
    if (!locationName) return "Unknown area";

    const parts = locationName
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length >= 2) {
        return parts[parts.length - 2];
    }

    return locationName;
}

function Home() {
    const [showForm, setShowForm] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [mapFocusReport, setMapFocusReport] = useState(null);

    const [searchText, setSearchText] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(true);

    const [detailReport, setDetailReport] = useState(null);

    const navigate = useNavigate();

    const fetchReports = () => {
        fetch(`${API_BASE_URL}/api/reports`)
            .then((res) => res.json())
            .then((data) => setReports(data))
            .catch((err) => console.error("Error fetching reports:", err));
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = useMemo(() => {
        const keyword = submittedSearch.trim().toLowerCase();

        if (!keyword) return [];

        return reports.filter((report) => {
            const pestName = (
                report.pest_name ||
                report.custom_pest_name ||
                ""
            ).toLowerCase();

            return pestName.includes(keyword);
        });
    }, [reports, submittedSearch]);

    const recentReports = useMemo(() => {
        return [...reports].slice(0, 3);
    }, [reports]);

    const handleSearchSubmit = () => {
        const keyword = searchText.trim();
        setSubmittedSearch(keyword);
        setShowSearchResults(true);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearchSubmit();
        }
    };

    const handleFocusMap = (report) => {
        setMapFocusReport(report);
        setSelectedReport(report);
    };

    const handleReportClick = () => {
        const currentUser = localStorage.getItem("currentUser");

        if (!currentUser) {
            setShowLoginPrompt(true);
            return;
        }

        setShowForm(true);
    };

    return (
        <main className="main-content">
            <div className="top-bar">
                <div className="search-container home-search-container">
                    <input
                        type="text"
                        placeholder="Start tracking pest in New Zealand"
                        className="search-input"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <button
                        className="search-btn"
                        type="button"
                        onClick={handleSearchSubmit}
                    >
                        Search
                    </button>
                </div>

                <button className="report-btn" onClick={handleReportClick}>
                    Report a Pest
                </button>
            </div>

            {submittedSearch.trim() && (
                <SearchResultsPanel
                    reports={filteredReports}
                    expanded={showSearchResults}
                    onToggle={() => setShowSearchResults((prev) => !prev)}
                    onClose={() => {
                        setSubmittedSearch("");
                        setShowSearchResults(false);
                    }}
                    onFocusMap={handleFocusMap}
                    onViewDetail={(report) => setDetailReport(report)}
                />
            )}

            <h2>Recent Pest Reports Map</h2>

            <div className="home-main-layout">
                <div className="home-map-main-column">
                    <HomeMap
                        reports={reports}
                        selectedReport={selectedReport}
                        setSelectedReport={setSelectedReport}
                        focusReport={mapFocusReport}
                        onViewDetail={(report) => setDetailReport(report)}
                    />
                </div>

                <aside className="home-recent-sidebar">
                    <div className="home-recent-sidebar-header">
                        <h3>Recent Reports</h3>
                    </div>

                    <div className="home-recent-sidebar-body">
                        {recentReports.length === 0 ? (
                            <p className="home-recent-empty-text">
                                No recent reports available.
                            </p>
                        ) : (
                            <div className="home-recent-report-list">
                                {recentReports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="home-recent-report-card"
                                    >
                                        <div className="home-recent-report-image-box">
                                            <img
                                                src={report.image_url || defaultReportImage}
                                                alt={getDisplayPestName(report)}
                                                className="home-recent-report-image"
                                            />
                                        </div>

                                        <div className="home-recent-report-info">
                                            <h4 className="home-recent-report-title">
                                                {getDisplayPestName(report)}
                                            </h4>

                                            <p>
                                                <strong>User:</strong> {getDisplayUsername(report)}
                                            </p>

                                            <p>
                                                <strong>Date:</strong> {getDisplayDate(report)}
                                            </p>

                                            <p>
                                                <strong>Area:</strong>{" "}
                                                {getCityLevelLocation(report.location_name)}
                                            </p>

                                            <div className="home-recent-report-actions">
                                                <button
                                                    type="button"
                                                    className="view-detail-btn"
                                                    onClick={() => setDetailReport(report)}
                                                >
                                                    View Detail
                                                </button>

                                                <button
                                                    type="button"
                                                    className="focus-map-btn"
                                                    onClick={() => handleFocusMap(report)}
                                                >
                                                    Show on Map
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        className="home-view-all-bar"
                        onClick={() => navigate("/reports")}
                    >
                        View All Reports
                    </div>
                </aside>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div
                        className="submit-report-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="submit-report-header-bar">
                            <h2>Submit a Pest Report</h2>
                            <button
                                className="close-btn submit-report-close-btn"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="submit-report-body">
                            <PestForm
                                onSuccess={() => {
                                    setShowForm(false);
                                    fetchReports();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showLoginPrompt && (
                <div className="modal-overlay" onClick={() => setShowLoginPrompt(false)}>
                    <div
                        className="login-prompt-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="login-prompt-close"
                            onClick={() => setShowLoginPrompt(false)}
                        >
                            ×
                        </button>

                        <h3>Please login first</h3>
                        <p>You need to log in before submitting a pest report.</p>

                        <Link
                            to="/login"
                            className="to-login-link"
                            onClick={() => setShowLoginPrompt(false)}
                        >
                            To Login
                        </Link>
                    </div>
                </div>
            )}

            {detailReport && (
                <ReportDetailModal
                    report={detailReport}
                    onClose={() => setDetailReport(null)}
                />
            )}
        </main>
    );
}

export default Home;