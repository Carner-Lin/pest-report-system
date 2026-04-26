import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PestForm from "../components/PestForm";
import SearchResultsPanel from "../components/SearchResultsPanel";
import ReportDetailModal from "../components/ReportDetailModal";
import HomeMap from "../components/HomeMap";

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

    const fetchReports = () => {
        fetch("http://localhost:5000/api/reports")
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
                    onFocusMap={handleFocusMap}
                    onViewDetail={(report) => setDetailReport(report)}
                />
            )}

            <h2>Recent Pest Reports Map</h2>

            <HomeMap
                reports={reports}
                selectedReport={selectedReport}
                setSelectedReport={setSelectedReport}
                focusReport={mapFocusReport}
            />

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