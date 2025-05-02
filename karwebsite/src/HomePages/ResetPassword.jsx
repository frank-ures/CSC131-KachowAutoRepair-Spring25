import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import loginBkgImg from "../components/login-bkg-img.jpg";
import "../components/Login.css";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        if (!email) {
            // No email in state, redirect back
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const validate = () => {
        if (!newPassword || newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        // For testing: bypass actual API, redirect to register
        setStatusMessage("Password reset successful! Redirecting to Log In...");
        setTimeout(() => navigate("/login"), 2000);
    };

    return (
        <div>
            <TopBar />
            <main className="login-main">
                <div className="login-container-wrapper">
                    <div className="login-form-container">
                        <h2>Reset Password</h2>
                        <p>Resetting password for <strong>{email}</strong></p>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <label htmlFor="new-password">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                autoFocus
                            />

                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />

                            {error && <span className="login-error-message">{error}</span>}

                            <button type="submit">Submit</button>
                        </form>
                        {statusMessage && (
                            <p style={{ color: "lightgreen", marginTop: "10px" }}>{statusMessage}</p>
                        )}
                        <div className="login-links">
                            <a className="login-link" onClick={() => navigate("/login")}>Back to Login</a>
                        </div>
                    </div>
                    <div className="login-image-container">
                        <img src={loginBkgImg} alt="Background" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResetPasswordPage;
