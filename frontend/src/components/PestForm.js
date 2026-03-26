import { useEffect, useState } from "react";

function PestForm() {
    const [pests, setPests] = useState([]);
    const [selectedPest, setSelectedPest] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/pests")
            .then((res) => res.json())
            .then((data) => setPests(data))
            .catch((err) => console.error("Error fetching pests:", err));
    }, []);

    return (
        <div>
            <h2>Submit a Pest Report</h2>

            <label>Select a pest:</label>
            <br />
            <select
                value={selectedPest}
                onChange={(e) => setSelectedPest(e.target.value)}
            >
                <option value="">-- Select from database --</option>
                {pests.map((pest) => (
                    <option key={pest.id} value={pest.id}>
                        {pest.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default PestForm;