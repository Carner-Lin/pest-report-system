import { useEffect, useState } from "react";
import PestForm from "../components/PestForm";
import { Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";

function Home() {
    const [showForm, setShowForm] = useState(false);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    const fetchReports = () => {
        fetch("http://localhost:5000/api/reports")
            .then((res) => res.json())
            .then((data) => setReports(data))
            .catch((err) => console.error("Error fetching reports:", err));
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const validReports = reports.filter(
        (report) => report.latitude !== null && report.longitude !== null
    );

    return (
        <main className="main-content">
            <div className="top-bar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Start tracking pest in New Zealand"
                        className="search-input"
                    />
                    <button className="search-btn">Search</button>
                </div>

                <button className="report-btn" onClick={() => setShowForm(true)}>
                    Report a Pest
                </button>
            </div>

            <h2>Recent Pest Reports Map</h2>

            <div
                className="home-map-wrapper"
                onWheel={(e) => e.stopPropagation()}
            >
                <Map
                    defaultCenter={{ lat: -37.787, lng: 175.279 }}
                    defaultZoom={11}
                    gestureHandling="greedy"
                    style={{ width: "100%", height: "600px" }}
                >
                    {validReports.map((report) => (
                        <Marker
                            key={report.id}
                            position={{
                                lat: Number(report.latitude),
                                lng: Number(report.longitude)
                            }}
                            onClick={() => setSelectedReport(report)}
                        />
                    ))}

                    {selectedReport && (
                        <InfoWindow
                            position={{
                                lat: Number(selectedReport.latitude),
                                lng: Number(selectedReport.longitude)
                            }}
                            onCloseClick={() => setSelectedReport(null)}
                        >
                            <div>
                                <strong>
                                    {selectedReport.pest_name ||
                                        selectedReport.custom_pest_name ||
                                        "Unknown pest"}
                                </strong>
                                <p>{selectedReport.location_name || "No location name"}</p>
                                <p>{selectedReport.description || "No description"}</p>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Submit a Pest Report</h2>
                            <button className="close-btn" onClick={() => setShowForm(false)}>
                                ×
                            </button>
                        </div>

                        <PestForm
                            onSuccess={() => {
                                setShowForm(false);
                                fetchReports();
                            }}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}

export default Home;