import { useEffect, useState } from "react";
import LocationPickerMap from "./LocationPickerMap";

function PestForm({ onSuccess }) {
    const [pests, setPests] = useState([]);
    const [message, setMessage] = useState("");
    const [imagePreview, setImagePreview] = useState("");

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

        fetch("http://localhost:5000/api/pests")
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

        setFormData((prev) => ({
            ...prev,
            pest_id: selectedId,
            custom_pest_name: selectedPest.name || "",
            pest_type: selectedPest.organism_type || "",
            description: selectedPest.description || "",
            status_choice: selectedPest.regulatory_status || "Uncertain",
            notifiable_choice:
                selectedPest.notifiable === 1 ||
                selectedPest.notifiable === "1" ||
                selectedPest.notifiable === true
                    ? "Yes"
                    : selectedPest.notifiable === 0 ||
                    selectedPest.notifiable === "0" ||
                    selectedPest.notifiable === false
                        ? "No"
                        : "Uncertain"
        }));
    };

    const handleLocationSelect = ({ lat, lng }) => {
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));

        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        )
            .then((res) => res.json())
            .then((data) => {
                const address = data.address || {};
                const cityLevel =
                    address.city ||
                    address.town ||
                    address.suburb ||
                    address.county ||
                    "";

                setFormData((prev) => ({
                    ...prev,
                    location_name: cityLevel
                }));
            })
            .catch((err) => {
                console.error("Reverse geocoding error:", err);
            });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        setFormData((prev) => ({
            ...prev,
            image_url: ""
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.custom_pest_name.trim()) {
            setMessage("Please enter a pest name or select one from the database.");
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            setMessage("Please select a location on the map.");
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

        fetch("http://localhost:5000/api/reports", {
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
                                <option value="Regulated">Regulated</option>
                                <option value="Non-regulated">Non-regulated</option>
                                <option value="Not assessed">Not assessed</option>
                                <option value="Uncertain">Uncertain</option>
                            </select>
                        </div>

                        <div className="submit-form-field">
                            <label>Notifiable</label>
                            <select
                                name="notifiable_choice"
                                value={formData.notifiable_choice}
                                onChange={handleChange}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Uncertain">Uncertain</option>
                            </select>
                        </div>
                    </div>

                    <div className="submit-form-field">
                        <label>Detailed description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what you found"
                        />
                    </div>

                    <div className="submit-form-field">
                        <label>Detailed location</label>
                        <input
                            type="text"
                            name="location_name"
                            value={formData.location_name}
                            onChange={handleChange}
                            placeholder="Auto-filled from selected map location"
                        />
                    </div>
                </div>

                <div className="submit-report-right">
                    <div className="submit-image-box">
                        <label className="submit-image-label">Upload pest image</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="submit-file-input"
                        />

                        <div className="submit-image-preview-box">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Pest preview"
                                    className="submit-image-preview"
                                />
                            ) : (
                                <div className="submit-image-placeholder">
                                    No image selected
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="submit-report-map-section">
                <h4>Select location on the map</h4>

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

                {formData.latitude && formData.longitude && (
                    <p className="selected-coordinates-text">
                        Selected coordinates: {Number(formData.latitude).toFixed(6)},{" "}
                        {Number(formData.longitude).toFixed(6)}
                    </p>
                )}
            </div>

            <button type="submit" className="submit-report-btn">
                Submit Report
            </button>

            {message && <p className="submit-report-message">{message}</p>}
        </form>
    );
}

export default PestForm;