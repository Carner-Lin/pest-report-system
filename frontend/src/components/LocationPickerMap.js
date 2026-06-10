import { useEffect } from "react";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";

// Bridges Google Maps click events back into React form state.
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

// Recenter the picker after geocoding or browser geolocation chooses a point.
function MapLocationController({ selectedLocation }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !selectedLocation) return;

        map.panTo(selectedLocation);
        map.setZoom(15);
    }, [map, selectedLocation]);

    return null;
}

// Lets users choose a report location by address, map click, or browser geolocation.
function LocationPickerMap({ selectedLocation, onSelectLocation }) {
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onSelectLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to get your current location.");
            },
            {
                // A pest sighting should use the freshest precise position available.
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    return (
        <div className="location-picker-wrapper">
            <button
                type="button"
                className="current-location-btn"
                onClick={handleUseCurrentLocation}
            >
                Use My Current Location
            </button>

            <div
                className="location-picker-map"
                onWheel={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <Map
                    defaultCenter={{ lat: -37.787, lng: 175.279 }}
                    defaultZoom={12}
                    gestureHandling="greedy"
                    style={{ width: "100%", height: "300px" }}
                >
                    <MapClickHandler onSelectLocation={onSelectLocation} />
                    <MapLocationController selectedLocation={selectedLocation} />

                    {selectedLocation && <Marker position={selectedLocation} />}
                </Map>
            </div>
        </div>
    );
}

export default LocationPickerMap;
