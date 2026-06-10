import LocationPickerMap from "../LocationPickerMap";

// This component handles manual address input and map-based location selection.
function PestLocationSection({
                                 formData,
                                 locationMessage,
                                 onChange,
                                 onUseTypedLocation,
                                 onSelectLocation,
                             }) {
    return (
        <div className="submit-report-map-section">
            <h4>Select report location</h4>

            <div className="form-group">
                <label>Address</label>
                <div className="location-input-row">
                    <input
                        type="text"
                        name="location_name"
                        placeholder="Enter address"
                        value={formData.location_name}
                        onChange={onChange}
                    />
                    <button
                        type="button"
                        className="location-search-btn"
                        onClick={onUseTypedLocation}
                    >
                        Locate
                    </button>
                </div>

                {locationMessage && (
                    <p className="location-error-text">{locationMessage}</p>
                )}
            </div>

            <LocationPickerMap
                selectedLocation={
                    formData.latitude && formData.longitude
                        ? {
                            lat: Number(formData.latitude),
                            lng: Number(formData.longitude),
                        }
                        : null
                }
                onSelectLocation={onSelectLocation}
            />

            {formData.latitude && formData.longitude && (
                <p className="selected-coordinates-text">
                    Selected coordinates: {Number(formData.latitude).toFixed(6)},{" "}
                    {Number(formData.longitude).toFixed(6)}
                </p>
            )}
        </div>
    );
}

export default PestLocationSection;