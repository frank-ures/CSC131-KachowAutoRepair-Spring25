import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar";
import loginBkgImg from "../images/login-bkg-img.jpg";
import "../components_CSS/Login.css";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle form submission for password reset request
    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setStatus("");
        setLoading(true);  // Reset states
        try {
            // Send password reset request to server
            const {data} = await axios.post(
                "http://localhost:5999/auth/forgot-password",
                {email}
            );
            setStatus(data.message);
            // Navigate to reset password page with user data
            navigate("/reset-password", {
                state: {userId: data.userId, email }
            });
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <TopBar />
            <main className="login-main">
                <div className="login-container-wrapper">
                    <div className="login-form-container">
                        <h2>Forgot Password</h2>
                        <form onSubmit={handleSubmit} className="login-form">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                            {error && <div className="login-error-message">{error}</div>}
                            <button type="submit" disabled={loading}>
                                {loading ? "Sending…" : "Send Reset Code"}
                            </button>
                        </form>
                        {status && <p style={{ color:"green" }}>{status}</p>}
                    </div>
                    <div className="login-image-container">
                        <img src={loginBkgImg} alt="background"/>
                    </div>
                </div>
            </main>
        </div>
    );
}