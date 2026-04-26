import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setSuccess(false);

        try {
            const res = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Login failed.");
                return;
            }

            setSuccess(true);
            setMessage("Login successful.");

            localStorage.setItem("currentUser", JSON.stringify(data.user));
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Server error.");
        }
    };

    return (
        <main className="main-content auth-page">
            <div className="auth-card">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Login
                    </button>
                    <div className="auth-switch-text">
                        Don’t have an account? <Link to="/register">Register</Link>
                    </div>
                </form>

                {message && (
                    <p className={success ? "auth-success" : "auth-error"}>{message}</p>
                )}
            </div>
        </main>
    );
}

export default Login;