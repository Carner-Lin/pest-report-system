import "./App.css";
import PestForm from "./components/PestForm";

function App() {
    return (
        <div className="App">
            <h1>Pest Reporting System</h1>
            <p>Report and track pest sightings in New Zealand.</p>
            <PestForm />
        </div>
    );
}

export default App;