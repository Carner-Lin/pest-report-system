import { useEffect, useState } from "react";
import { getPests } from "../services/api";

// This page displays common or high-priority pests in New Zealand.
function PestEncyclopedia() {
    const [pests, setPests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPests = async () => {
            try {
                const data = await getPests();
                setPests(data);
            } catch (err) {
                console.error("Error fetching pests:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPests();
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