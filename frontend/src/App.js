import { useEffect, useState } from "react";
import "./App.css";

function App() {

    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/test")
            .then(res => res.json())
            .then(data => setMessage(data.message));
    }, []);

    return (
        <div className="App">
            <h1>Pest Reporting System</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;