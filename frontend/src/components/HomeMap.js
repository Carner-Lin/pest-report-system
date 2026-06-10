import { useEffect } from "react";
import {
    Map,
    useMap,
    AdvancedMarker,
} from "@vis.gl/react-google-maps";

import {
    getMarkerIconByType,
    insectIcon,
    mammalIcon,
    plantIcon,
    birdIcon,
    spiderIcon,
    otherIcon,
} from "../utils/mapHelpers";
import { getDisplayPestName } from "../utils/reportHelpers";

const DEFAULT_CENTER = { lat: -37.787, lng: 175.279 };

// This controller moves the map to a selected report location.
function MapController({ focusReport }) {
    const map = useMap();

    useEffect(() => {
        if (
            !map ||
            !focusReport ||
            focusReport.latitude == null ||
            focusReport.longitude == null
        ) {
            return;
        }

        const target = {
            lat: Number(focusReport.latitude),
            lng: Number(focusReport.longitude),
        };

        map.panTo(target);
        map.setZoom(14);
    }, [map, focusReport]);

    return null;
}

// This component renders the report markers and popup on the home map.
export default function HomeMap({
                                    reports,
                                    selectedReport,
                                    setSelectedReport,
                                    focusReport,
                                    onViewDetail,
                                }) {
    // Skip reports without coordinates so Google Maps only receives valid markers.
    const validReports = reports.filter(
        (report) => report.latitude != null && report.longitude != null
    );

    return (
        <div
            className="home-map-wrapper"
            onWheel={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={15}
                gestureHandling="greedy"
                style={{ width: "100%", height: "650px" }}
                mapId="5fa018df7a7cece3bb08d70f"
            >
                <MapController focusReport={focusReport} />

                {validReports.map((report) => (
                    <AdvancedMarker
                        key={report.id}
                        position={{
                            lat: Number(report.latitude),
                            lng: Number(report.longitude),
                        }}
                        onClick={() => setSelectedReport(report)}
                        anchorLeft="-50%"
                        anchorTop="-34px"
                        zIndex={10}
                    >
                        <div className="custom-landmark-marker" title="Click to view details">
                            <div className="custom-landmark-circle">
                                <img
                                    src={getMarkerIconByType(report)}
                                    alt="Pest icon"
                                    className="custom-landmark-inner-icon"
                                />
                            </div>
                            <div className="custom-landmark-pointer"></div>
                        </div>
                    </AdvancedMarker>
                ))}

                {selectedReport &&
                    selectedReport.latitude != null &&
                    selectedReport.longitude != null && (
                        <AdvancedMarker
                            position={{
                                lat: Number(selectedReport.latitude),
                                lng: Number(selectedReport.longitude),
                            }}
                            anchorLeft="-50%"
                            anchorTop="-118px"
                            zIndex={1000}
                        >
                            <div className="custom-map-popup">
                                <button
                                    type="button"
                                    className="custom-map-popup-close"
                                    onClick={() => setSelectedReport(null)}
                                >
                                    ×
                                </button>

                                <div className="custom-map-popup-top">
                                    <div className="map-info-icon-box">
                                        <img
                                            src={getMarkerIconByType(selectedReport)}
                                            alt="Pest icon"
                                            className="map-info-icon"
                                        />
                                    </div>

                                    <div className="map-info-text">
                                        <strong>{getDisplayPestName(selectedReport)}</strong>
                                        <p>{selectedReport.location_name || "No location name"}</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="map-detail-btn"
                                    onClick={() => onViewDetail && onViewDetail(selectedReport)}
                                >
                                    View Report Detail
                                </button>
                            </div>
                        </AdvancedMarker>
                    )}
            </Map>

            <div className="map-legend">
                <h4>Legend</h4>

                <div className="legend-item">
                    <img src={insectIcon} alt="Insect icon" />
                    <span>Insect</span>
                </div>

                <div className="legend-item">
                    <img src={mammalIcon} alt="Mammal icon" />
                    <span>Mammal</span>
                </div>

                <div className="legend-item">
                    <img src={plantIcon} alt="Plant icon" />
                    <span>Plant</span>
                </div>

                <div className="legend-item">
                    <img src={birdIcon} alt="Bird icon" />
                    <span>Bird</span>
                </div>

                <div className="legend-item">
                    <img src={spiderIcon} alt="Spider icon" />
                    <span>Spider</span>
                </div>

                <div className="legend-item">
                    <img src={otherIcon} alt="Other icon" />
                    <span>Other</span>
                </div>
            </div>
        </div>
    );
}
