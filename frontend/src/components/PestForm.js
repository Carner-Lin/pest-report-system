import { useEffect, useState } from "react";
import LocationPickerMap from "./LocationPickerMap";

function PestForm({ onSuccess }) {
    const [pests, setPests] = useState([]);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        user_id: null,
        pest_id: "",
        custom_pest_name: "",
        description: "",
        location_name: "",
        latitude: "",
        longitude: "",
        image_url: ""
    });

    useEffect(() => {
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

    const handleLocationSelect = ({ lat, lng }) => {
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.pest_id && !formData.custom_pest_name.trim()) {
            setMessage("Please select a pest or enter a pest name.");
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            setMessage("Please select a location on the map.");
            return;
        }

        const payload = {
            ...formData,
            pest_id: formData.pest_id ? Number(formData.pest_id) : null,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            image_url: formData.image_url || null
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
                    user_id: null,
                    pest_id: "",
                    custom_pest_name: "",
                    description: "",
                    location_name: "",
                    latitude: "",
                    longitude: "",
                    image_url: ""
                });

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
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select a pest:</label>
                    <br />
                    <select
                        name="pest_id"
                        value={formData.pest_id}
                        onChange={handleChange}
                    >
                        <option value="">-- Select from database --</option>
                        {pests.map((pest) => (
                            <option key={pest.id} value={pest.id}>
                                {pest.name}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Or enter a pest name manually:</label>
                    <br />
                    <input
                        type="text"
                        name="custom_pest_name"
                        value={formData.custom_pest_name}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Description:</label>
                    <br />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Location name:</label>
                    <br />
                    <input
                        type="text"
                        name="location_name"
                        value={formData.location_name}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Select location on the map:</label>
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

                <br />

                {formData.latitude && formData.longitude && (
                    <p>
                        Selected coordinates: {Number(formData.latitude).toFixed(6)},{" "}
                        {Number(formData.longitude).toFixed(6)}
                    </p>
                )}

                <button type="submit">Submit Report</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default PestForm;