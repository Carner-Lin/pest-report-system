import { useEffect, useState } from "react";
import PestBasicFields from "./pestForm/PestBasicFields";
import PestImageSection from "./pestForm/PestImageSection";
import PestLocationSection from "./pestForm/PestLocationSection";
import {
    getEmptyFormData,
    buildDetailedLocation,
    getNotifiableValue,
} from "./pestForm/pestFormHelpers";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Main form component for creating a pest report.
function PestForm({ onSuccess }) {
    const [pests, setPests] = useState([]);
    const [message, setMessage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [locationMessage, setLocationMessage] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    const [formData, setFormData] = useState(getEmptyFormData());

    // Load current user and pest list when the form opens.
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

        if (currentUser) {
            setFormData((prev) => ({
                ...prev,
                user_id: currentUser.id,
            }));
        }

        fetch(`${API_BASE_URL}/api/pests`)
            .then((res) => res.json())
            .then((data) => setPests(data))
            .catch((err) => console.error("Error fetching pests:", err));
    }, []);

    // Update a normal input field.
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Fill fields when a pest is selected from the database.
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
                notifiable_choice: "Uncertain",
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
            notifiable_choice: getNotifiableValue(selectedPest.notifiable),
        }));
    };

    // Update form data after a map click and reverse geocode the location.
    const handleLocationSelect = ({ lat, lng }) => {
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
        }));

        setLocationMessage("");

        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
        )
            .then((res) => res.json())
            .then((data) => {
                const detailedLocation = buildDetailedLocation(data.address || "");

                setFormData((prev) => ({
                    ...prev,
                    location_name: detailedLocation,
                }));
            })
            .catch((err) => {
                console.error("Reverse geocoding error:", err);
            });
    };

    // Convert a typed address into coordinates.
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
                    location_name: result.display_name || prev.location_name,
                }));

                setLocationMessage("");
            })
            .catch((err) => {
                console.error("Geocoding error:", err);
                setLocationMessage("Invalid address.");
            });
    };

    // Store the selected image and generate a preview URL.
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImageFile(file);
        setImagePreview(URL.createObjectURL(file));

        setFormData((prev) => ({
            ...prev,
            image_url: "",
        }));

        setAiResult(null);
    };

    // Send the uploaded image to the AI route and fill the predicted fields.
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
                body: dataToSend,
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to identify pest.");
                return;
            }

            setAiResult(data);

            setFormData((prev) => ({
                ...prev,
                custom_pest_name: data.predicted_name || prev.custom_pest_name,
                pest_type: data.predicted_type || prev.pest_type,
                description: data.description || prev.description,
            }));
        } catch (error) {
            console.error("AI identify error:", error);
            alert("Server error.");
        } finally {
            setAiLoading(false);
        }
    };

    // Submit the final pest report to the backend.
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.custom_pest_name.trim()) {
            setMessage("Please enter a pest name or select one from the database.");
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            setMessage("Please select a location on the map or validate the address.");
            return;
        }

        try {
            const dataToSend = new FormData();

            dataToSend.append("user_id", formData.user_id || "");
            dataToSend.append("pest_id", formData.pest_id || "");
            dataToSend.append("custom_pest_name", formData.custom_pest_name || "");
            dataToSend.append("pest_type", formData.pest_type || "");
            dataToSend.append("description", formData.description || "");
            dataToSend.append("location_name", formData.location_name || "");
            dataToSend.append("latitude", formData.latitude || "");
            dataToSend.append("longitude", formData.longitude || "");
            dataToSend.append("status_choice", formData.status_choice || "Uncertain");
            dataToSend.append("notifiable_choice", formData.notifiable_choice || "Uncertain");

            if (selectedImageFile) {
                dataToSend.append("image", selectedImageFile);
            }

            const res = await fetch(`${API_BASE_URL}/api/reports`, {
                method: "POST",
                body: dataToSend,
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Failed to submit report.");
                return;
            }

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
        } catch (err) {
            console.error("Error submitting report:", err);
            setMessage("Failed to submit report.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="submit-report-form">
            <div className="submit-report-top">
                <div className="submit-report-left">
                    <PestBasicFields
                        pests={pests}
                        formData={formData}
                        onChange={handleChange}
                        onDatabaseSelect={handleDatabaseSelect}
                    />
                </div>

                <div className="submit-report-right">
                    <PestImageSection
                        selectedImageFile={selectedImageFile}
                        imagePreview={imagePreview}
                        aiLoading={aiLoading}
                        aiResult={aiResult}
                        onImageChange={handleImageChange}
                        onIdentifyPest={handleIdentifyPest}
                    />
                </div>
            </div>

            <PestLocationSection
                formData={formData}
                locationMessage={locationMessage}
                onChange={handleChange}
                onUseTypedLocation={handleUseTypedLocation}
                onSelectLocation={handleLocationSelect}
            />

            <button type="submit" className="submit-report-btn">
                Submit Report
            </button>

            {message && <p className="submit-report-message">{message}</p>}
        </form>
    );
}

export default PestForm;