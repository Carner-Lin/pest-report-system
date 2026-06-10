import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import "./App.css";
import Home from "./pages/Home";
import PestReports from "./pages/PestReports";
import PestEncyclopedia from "./pages/PestEncyclopedia";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Keep the navbar user state in sync with localStorage changes.
        const loadCurrentUser = () => {
            const storedUser = localStorage.getItem("currentUser");
            setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
        };

        loadCurrentUser();

        const handleUserChanged = () => {
            loadCurrentUser();
        };

        // Close the user menu when the user clicks outside the dropdown.
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setShowUserMenu(false);
            }
        };

        window.addEventListener("userChanged", handleUserChanged);
        window.addEventListener("storage", handleUserChanged);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("userChanged", handleUserChanged);
            window.removeEventListener("storage", handleUserChanged);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Notify this tab so components that read currentUser can refresh immediately.
        localStorage.removeItem("currentUser");
        window.dispatchEvent(new Event("userChanged"));
        setShowUserMenu(false);
        navigate("/");
    };

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
                        {currentUser ? (
                            <div className="nav-user-menu" ref={userMenuRef}>
                                <button
                                    type="button"
                                    className="nav-user-btn"
                                    onClick={() => setShowUserMenu((prev) => !prev)}
                                >
                                    {currentUser.username}  ▾
                                </button>

                                {showUserMenu && (
                                    <div className="nav-user-dropdown">
                                        <Link
                                            to="/profile"
                                            className="nav-user-dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Profile
                                        </Link>

                                        <button
                                            type="button"
                                            className="nav-user-dropdown-item logout-item"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="nav-btn">Login</Link>
                                <Link to="/register" className="nav-btn">Register</Link>
                            </>
                        )}
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/reports" element={<PestReports />} />
                    <Route path="/encyclopedia" element={<PestEncyclopedia />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </APIProvider>
    );
}

export default App;
