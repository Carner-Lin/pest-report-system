import { Link, Routes, Route } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import "./App.css";
import Home from "./pages/Home";
import PestReports from "./pages/PestReports";
import PestEncyclopedia from "./pages/PestEncyclopedia";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <APIProvider
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            language="en"
            region="NZ"
        >
            <div className="app-container">
                <nav className="navbar">
                    <div className="navbar-left">
                        <h1 className="navbar-title">Pest Reporting System</h1>

                        <div className="nav-links">
                            <Link to="/" className="nav-btn">Home</Link>
                            <Link to="/reports" className="nav-btn">Pest Reports</Link>
                            <Link to="/encyclopedia" className="nav-btn">Pest Encyclopedia</Link>
                        </div>
                    </div>

                    <div className="navbar-right">
                        <Link to="/login" className="nav-btn">Login</Link>
                        <Link to="/register" className="nav-btn">Register</Link>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/reports" element={<PestReports />} />
                    <Route path="/encyclopedia" element={<PestEncyclopedia />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </APIProvider>
    );
}

export default App;