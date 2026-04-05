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

export default function SearchResultsPanel({
                                               reports,
                                               expanded,
                                               onToggle,
                                               onFocusMap,
                                               onViewDetail,
                                           }) {
    return (
        <section className="home-search-results-section">
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