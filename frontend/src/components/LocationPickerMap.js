import { useEffect } from "react";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";

function MapClickHandler({ onSelectLocation }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const listener = map.addListener("click", (e) => {
            if (!e.latLng) return;

            onSelectLocation({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            });
        });

        return () => listener.remove();
    }, [map, onSelectLocation]);

    return null;
}

function LocationPickerMap({ selectedLocation, onSelectLocation }) {
    return (
        <div
            className="location-picker-map"
            onWheel={(e) => e.stopPropagation()}
        >
            <Map
                defaultCenter={selectedLocation || { lat: -37.787, lng: 175.279 }}
                defaultZoom={12}
                gestureHandling="greedy"
                style={{ width: "100%", height: "300px" }}
            >
                <MapClickHandler onSelectLocation={onSelectLocation} />
                {selectedLocation && <Marker position={selectedLocation} />}
            </Map>
        </div>
    );
}

export default LocationPickerMap;