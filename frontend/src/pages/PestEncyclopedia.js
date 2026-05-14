import { useEffect, useState } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PestEncyclopedia() {
    const [pests, setPests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/pests`)
            .then((res) => res.json())
            .then((data) => {
                setPests(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching pests:", err);
                setLoading(false);
            });
    }, []);

    return (
        <main className="main-content">
            <h2>Pest Encyclopedia</h2>
            <p className="encyclopedia-desc">
                This page presents a selection of common or high-priority pests in New Zealand,
                including species that may impact native ecosystems, agriculture, or public health.
            </p>

            {loading ? (
                <p>Loading pest data...</p>
            ) : (
                <div className="pest-grid">
                    {pests.map((pest) => (
                        <div key={pest.id} className="pest-card">
                            {pest.image_url ? (
                                <img
                                    src={pest.image_url}
                                    alt={pest.name}
                                    className="pest-image"
                                />
                            ) : (
                                <div className="pest-image placeholder">No Image</div>
                            )}

                            <h3>{pest.name}</h3>
                            <p><strong>Type:</strong> {pest.organism_type}</p>
                            <p><strong>Status:</strong> {pest.regulatory_status}</p>
                            <p><strong>Notifiable:</strong> {pest.notifiable ? "Yes" : "No"}</p>
                            <p>{pest.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default PestEncyclopedia;