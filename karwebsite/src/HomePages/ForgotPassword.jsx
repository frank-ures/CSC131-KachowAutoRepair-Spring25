import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import loginBkgImg from "../components/login-bkg-img.jpg";
import "../components/Login.css";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const validateEmail = () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.match(regex)) {
            setEmailError("Please enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail()) return;
        setStatusMessage("Email recognized. Redirecting to reset password...");
        setTimeout(() => {
            // Pass email to reset page via state
            navigate("/reset-password", { state: { email } });
        }, 1000);
    };

    return (
        <div>
            <TopBar />
            <main className="login-main">
                <div className="login-container-wrapper">
                    <div className="login-form-container">
                        <h2>Forgot Password</h2>
                        <p>Please enter the email associated with your account</p>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={validateEmail}
                                placeholder="Enter your email"
                            />
                            {emailError && <span className="login-error-message">{emailError}</span>}
                            <button type="submit">Submit</button>
                        </form>
                        {statusMessage && (
                            <p style={{ color: "lightgreen", marginTop: "10px" }}>{statusMessage}</p>
                        )}
                        <div className="login-links">
                            <a className="login-link" onClick={() => navigate("/login")}>Back to Login</a>
                            <a className="login-link" onClick={() => navigate("/register")}>Don't Have An Account? Sign Up</a>
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

export default ForgotPasswordPage;
