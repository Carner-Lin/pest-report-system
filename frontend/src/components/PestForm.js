import { useEffect, useState } from "react";
import LocationPickerMap from "./LocationPickerMap";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PestForm({ onSuccess }) {
    const [pests, setPests] = useState([]);
    const [message, setMessage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [locationMessage, setLocationMessage] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    const [formData, setFormData] = useState({
        user_id: null,
        pest_id: "",
        custom_pest_name: "",
        pest_type: "",
        description: "",
        location_name: "",
        latitude: "",
        longitude: "",
        image_url: "",
        status_choice: "Uncertain",
        notifiable_choice: "Uncertain"
    });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

        if (currentUser) {
            setFormData((prev) => ({
                ...prev,
                user_id: currentUser.id
            }));
        }

        fetch(`${API_BASE_URL}/api/pests`)
            .then((res) => res.json())
            .then((data) => setPests(data))
            .catch((err) => console.error("Error fetching pests:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDatabaseSelect = (e) => {
        const selectedId = e.target.value;

        if (!selectedId) {
            setFormData((prev) => ({
                ...prev,
                pest_id: "",
                custom_pest_name: "",
                pest_type: "",
                description: "",
                status_choice: "Uncertain",
                notifiable_choice: "Uncertain"
            }));
            return;
        }

        const selectedPest = pests.find(
            (pest) => Number(pest.id) === Number(selectedId)
        );

        if (!selectedPest) return;

        let notifiableValue = "Uncertain";

        if (
            selectedPest.notifiable === 1 ||
            selectedPest.notifiable === "1" ||
            selectedPest.notifiable === true
        ) {
            notifiableValue = "Yes";
        } else if (
            selectedPest.notifiable === 0 ||
            selectedPest.notifiable === "0" ||
            selectedPest.notifiable === false
        ) {
            notifiableValue = "No";
        }

        setFormData((prev) => ({
            ...prev,
            pest_id: selectedId,
            custom_pest_name: selectedPest.name || "",
            pest_type: selectedPest.organism_type || "",
            description: selectedPest.description || "",
            status_choice: selectedPest.regulatory_status || "Uncertain",
            notifiable_choice: notifiableValue
        }));
    };

    const handleLocationSelect = ({ lat, lng }) => {
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));

        setLocationMessage("");

        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
        )
            .then((res) => res.json())
            .then((data) => {
                const address = data.address || {};

                const street =
                    [address.house_number, address.road]
                        .filter(Boolean)
                        .join(" ") || "";

                const suburb =
                    address.suburb ||
                    address.neighbourhood ||
                    address.hamlet ||
                    "";

                const city =
                    address.city ||
                    address.town ||
                    address.village ||
                    address.county ||
                    "";

                const state = address.state || "";

                const detailedLocation = [street, suburb, city, state]
                    .filter(Boolean)
                    .join(", ");

                setFormData((prev) => ({
                    ...prev,
                    location_name: detailedLocation
                }));
            })
            .catch((err) => {
                console.error("Reverse geocoding error:", err);
            });
    };

    const handleUseTypedLocation = () => {
        const query = formData.location_name.trim();

        if (!query) {
            setLocationMessage("Please enter an address first.");
            return;
        }

        setLocationMessage("");

        fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
                query
            )}&limit=1&accept-language=en`
        )
            .then((res) => res.json())
            .then((data) => {
                if (!data || data.length === 0) {
                    setLocationMessage("Invalid address.");
                    return;
                }

                const result = data[0];
                const lat = Number(result.lat);
                const lng = Number(result.lon);

                setFormData((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                    location_name: result.display_name || prev.location_name
                }));

                setLocationMessage("");
            })
            .catch((err) => {
                console.error("Geocoding error:", err);
                setLocationMessage("Invalid address.");
            });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImageFile(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        setFormData((prev) => ({
            ...prev,
            image_url: ""
        }));

        setAiResult(null);
    };

    const handleIdentifyPest = async () => {
        if (!selectedImageFile) {
            alert("Please upload an image first.");
            return;
        }

        setAiLoading(true);
        setAiResult(null);

        try {
            const dataToSend = new FormData();
            dataToSend.append("image", selectedImageFile);

            const res = await fetch(`${API_BASE_URL}/api/ai/identify-pest`, {
                method: "POST",
                body: dataToSend
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to identify pest.");
                setAiLoading(false);
                return;
            }

            setAiResult(data);

            setFormData((prev) => ({
                ...prev,
                custom_pest_name: data.predicted_name || prev.custom_pest_name,
                pest_type: data.predicted_type || prev.pest_type,
                description: data.description || prev.description
            }));
        } catch (error) {
            console.error("AI identify error:", error);
            alert("Server error.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.custom_pest_name.trim()) {
            setMessage("Please enter a pest name or select one from the database.");
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            setMessage("Please select a location on the map or validate the address.");
            return;
        }

        const payload = {
            user_id: formData.user_id,
            pest_id: formData.pest_id ? Number(formData.pest_id) : null,
            custom_pest_name: formData.custom_pest_name,
            pest_type: formData.pest_type,
            description: formData.description,
            location_name: formData.location_name,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            image_url: formData.image_url || null,
            status_choice: formData.status_choice,
            notifiable_choice: formData.notifiable_choice
        };

        fetch(`${API_BASE_URL}/api/reports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((res) => res.json())
            .then((data) => {
                setMessage(data.message || "Report submitted successfully.");

                setFormData({
                    user_id: formData.user_id,
                    pest_id: "",
                    custom_pest_name: "",
                    pest_type: "",
                    description: "",
                    location_name: "",
                    latitude: "",
                    longitude: "",
                    image_url: "",
                    status_choice: "Uncertain",
                    notifiable_choice: "Uncertain"
                });

                setImagePreview("");
                setSelectedImageFile(null);
                setAiResult(null);
                setLocationMessage("");

                const fileInput = document.getElementById("pest-image-upload");
                if (fileInput) {
                    fileInput.value = "";
                }

                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 500);
                }
            })
            .catch((err) => {
                console.error("Error submitting report:", err);
                setMessage("Failed to submit report.");
            });
    };

    return (
        <form onSubmit={handleSubmit} className="submit-report-form">
            <div className="submit-report-top">
                <div className="submit-report-left">
                    <div className="submit-form-field">
                        <label>Select from database (optional)</label>
                        <select
                            name="pest_id"
                            value={formData.pest_id}
                            onChange={handleDatabaseSelect}
                        >
                            <option value="">-- Select from database --</option>
                            {pests.map((pest) => (
                                <option key={pest.id} value={pest.id}>
                                    {pest.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="submit-form-field">
                        <label>Pest name</label>
                        <input
                            type="text"
                            name="custom_pest_name"
                            value={formData.custom_pest_name}
                            onChange={handleChange}
                            placeholder="Enter pest name"
                        />
                    </div>

                    <div className="submit-form-field">
                        <label>Pest type</label>
                        <input
                            type="text"
                            name="pest_type"
                            value={formData.pest_type}
                            onChange={handleChange}
                            placeholder="Enter pest type"
                        />
                    </div>

                    <div className="submit-inline-fields">
                        <div className="submit-form-field">
                            <label>Status</label>
                            <select
                                name="status_choice"
                                value={formData.status_choice}
                                onChange={handleChange}
                            >
                                <option value="Uncertain">Uncertain</option>
                                <option value="Regulated">Regulated</option>
                                <option value="Non-regulated">Non-regulated</option>
                                <option value="Not assessed">Not assessed</option>
                            </select>
                        </div>

                        <div className="submit-form-field">
                            <label>Notifiable</label>
                            <select
                                name="notifiable_choice"
                                value={formData.notifiable_choice}
                                onChange={handleChange}
                            >
                                <option value="Uncertain">Uncertain</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>

                    <div className="submit-form-field">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter pest description"
                        />
                    </div>

                    <div className="submit-form-field">
                        <label>Detailed location</label>
                        <div className="location-input-row">
                            <input
                                type="text"
                                name="location_name"
                                value={formData.location_name}
                                onChange={handleChange}
                                placeholder="Enter or select a location"
                            />
                            <button
                                type="button"
                                className="location-search-btn"
                                onClick={handleUseTypedLocation}
                            >
                                Locate
                            </button>
                        </div>
                        {locationMessage && (
                            <p className="location-error-text">{locationMessage}</p>
                        )}
                    </div>
                </div>

                <div className="submit-report-right">
                    <div className="submit-image-box">
                        <div className="submit-image-header">
                            <label className="submit-image-label">Upload pest image</label>
                            <button
                                type="button"
                                className="ai-identify-btn"
                                onClick={handleIdentifyPest}
                                disabled={aiLoading}
                            >
                                {aiLoading ? "Identifying..." : "Identify with AI"}
                            </button>
                        </div>

                        <div className="custom-file-upload">
                            <input
                                id="pest-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden-file-input"
                            />

                            <label htmlFor="pest-image-upload" className="custom-file-btn">
                                Choose File
                            </label>

                            <span className="custom-file-name">
                                {selectedImageFile ? selectedImageFile.name : "No file chosen"}
                            </span>
                        </div>

                        <div className="submit-image-preview-box">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="submit-image-preview"
                                />
                            ) : (
                                <div className="submit-image-placeholder">
                                    No image selected
                                </div>
                            )}
                        </div>

                        {aiResult && (
                            <div className="ai-result-box">
                                <p><strong>AI Predicted Name:</strong> {aiResult.predicted_name}</p>
                                <p><strong>Type:</strong> {aiResult.predicted_type}</p>
                                <p><strong>Confidence:</strong> {Math.round((aiResult.confidence || 0) * 100)}%</p>
                                <p className="ai-result-note">
                                    AI suggestion only. Please verify before submitting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="submit-report-map-section">
                <h4>Select report location</h4>
                <LocationPickerMap
                    selectedLocation={
                        formData.latitude && formData.longitude
                            ? {
                                lat: Number(formData.latitude),
                                lng: Number(formData.longitude)
                            }
                            : null
                    }
                    onSelectLocation={handleLocationSelect}
                />
            </div>

            <button type="submit" className="submit-report-btn">
                Submit Report
            </button>

            {message && <p className="submit-report-message">{message}</p>}
        </form>
    );
}

export default PestForm;