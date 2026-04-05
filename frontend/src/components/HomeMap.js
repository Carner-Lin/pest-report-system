import { useEffect } from "react";
import { Map, Marker, InfoWindow, useMap } from "@vis.gl/react-google-maps";

const DEFAULT_CENTER = { lat: -37.787, lng: 175.279 };

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

export default function HomeMap({
                                    reports,
                                    selectedReport,
                                    setSelectedReport,
                                    focusReport,
                                }) {
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
                defaultZoom={11}
                gestureHandling="greedy"
                style={{ width: "100%", height: "600px" }}
            >
                <MapController focusReport={focusReport} />

                {validReports.map((report) => (
                    <Marker
                        key={report.id}
                        position={{
                            lat: Number(report.latitude),
                            lng: Number(report.longitude),
                        }}
                        onClick={() => setSelectedReport(report)}
                    />
                ))}

                {selectedReport &&
                    selectedReport.latitude != null &&
                    selectedReport.longitude != null && (
                        <InfoWindow
                            position={{
                                lat: Number(selectedReport.latitude),
                                lng: Number(selectedReport.longitude),
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
    );
}