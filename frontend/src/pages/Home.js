import { useState } from "react";
import PestForm from "../components/PestForm";

function Home() {
    const [showForm, setShowForm] = useState(false);

    return (
        <main className="main-content">
            <div className="top-bar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Start tracking pest in New Zealand"
                        className="search-input"
                    />
                    <button className="search-btn">Search</button>
                </div>

                <button className="report-btn" onClick={() => setShowForm(true)}>
                    Report a Pest
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Submit a Pest Report</h2>
                            <button className="close-btn" onClick={() => setShowForm(false)}>
                                ×
                            </button>
                        </div>

                        <PestForm onSuccess={() => setShowForm(false)} />
                    </div>
                </div>
            )}
        </main>
    );
}

export default Home;