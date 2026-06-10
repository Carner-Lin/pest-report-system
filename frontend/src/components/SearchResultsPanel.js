import {
    getDisplayPestName,
    getDisplayUsername,
    getDisplayDate,
    getCityLevelLocation,
} from "../utils/reportHelpers";

// This component displays the search result cards on the home page.
export default function SearchResultsPanel({
                                               reports,
                                               expanded,
                                               onToggle,
                                               onClose,
                                               onFocusMap,
                                               onViewDetail,
                                           }) {
    return (
        <section className="home-search-results-section">
            <div className="results-controls">
                <button
                    type="button"
                    className="results-toggle-btn"
                    onClick={onToggle}
                    aria-expanded={expanded}
                >
                    <span className={`results-toggle-icon ${expanded ? "expanded" : ""}`}>
                        ▾
                    </span>
                </button>

                <button
                    type="button"
                    className="results-close-btn"
                    onClick={onClose}
                    aria-label="Close search results"
                >
                    ×
                </button>
            </div>

            <div
                className={`home-search-results-collapse ${
                    expanded ? "expanded" : "collapsed"
                }`}
            >
                <div className="home-search-results-box">
                    {reports.length === 0 ? (
                        <p className="search-empty-text">No matching pest reports found.</p>
                    ) : (
                        <div className="home-search-results-row">
                            {reports.map((report) => (
                                <div key={report.id} className="home-result-card">
                                    <h3 className="home-result-title">
                                        {getDisplayPestName(report)}
                                    </h3>

                                    <p>
                                        <strong>Uploaded by:</strong> {getDisplayUsername(report)}
                                    </p>

                                    <p>
                                        <strong>Date:</strong> {getDisplayDate(report)}
                                    </p>

                                    <p>
                                        <strong>Area:</strong>{" "}
                                        {getCityLevelLocation(report.location_name)}
                                    </p>

                                    <div className="home-result-card-actions">
                                        <button
                                            type="button"
                                            className="view-detail-btn"
                                            onClick={() => onViewDetail(report)}
                                        >
                                            View Detail
                                        </button>

                                        <button
                                            type="button"
                                            className="focus-map-btn"
                                            onClick={() => onFocusMap(report)}
                                        >
                                            Show on Map
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}