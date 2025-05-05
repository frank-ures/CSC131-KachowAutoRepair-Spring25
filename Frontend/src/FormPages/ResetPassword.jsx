import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar";
import loginBkgImg from "../images/login-bkg-img.jpg";
import "../components_CSS/Login.css";

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { userId, email } = state || {};

    const [code, setCode] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [loadingReset, setLoadingReset] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // Countdown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    useEffect(() => {
        if (!userId || !email) navigate("/forgot-password");
    }, [userId, email, navigate]);

    const validate = () => {
        if (newPwd.length < 6) {
            setError("Password must be ≥6 characters");
            return false;
        }
        if (newPwd !== confirm) {
            setError("Passwords do not match");
            return false;
        }
        if (!/^\d{6}$/.test(code)) {
            setError("Enter the 6-digit code");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoadingReset(true);
        setError("");
        setStatus("");

        try {
            const { data } = await axios.post(
                "http://localhost:5999/auth/reset-password",
                { userId, code, newPassword: newPwd }
            );
            setStatus(data.message);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Reset failed");
        } finally {
            setLoadingReset(false);
        }
    };

    const handleResend = async () => {
        // *** Guard against premature resends ***
        if (cooldown > 0) {
            console.log(`Resend blocked: ${cooldown}s left`);
            return;
        }

        setLoadingResend(true);
        setError("");
        setStatus("");

        try {
            await axios.post(
                "http://localhost:5999/auth/forgot-password",
                { email }
            );
            setStatus("Code resent! Check your email.");
            setCooldown(30); // start cooldown
        } catch (err) {
            setError(err.response?.data?.error || "Failed to resend code");
        } finally {
            setLoadingResend(false);
        }
    };

    return (
        <div>
            <TopBar />
            <main className="login-main">
                <div className="login-container-wrapper">
                    <div className="login-form-container">
                        <h2>Reset Password</h2>
                        <p>for <strong>{email}</strong></p>
                        <form onSubmit={handleSubmit} className="login-form">
                            <label>Reset Code</label>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={loadingReset || loadingResend}
                                autoFocus
                            />

                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPwd}
                                onChange={(e) => setNewPwd(e.target.value)}
                                disabled={loadingReset || loadingResend}
                            />

                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                disabled={loadingReset || loadingResend}
                            />

                            {error && <div className="login-error-message">{error}</div>}

                            <button
                                type="submit"
                                disabled={loadingReset}
                                style={{ width: "100%", marginBottom: "8px" }}
                            >
                                {loadingReset ? "Resetting…" : "Reset Password"}
                            </button>

                            <button
                                type="button"
                                onClick={handleResend}
                                // disable if cooling down OR actively resending
                                disabled={loadingResend || cooldown > 0}
                                style={{ width: "100%" }}
                            >
                                {loadingResend
                                    ? "Resending…"
                                    : cooldown > 0
                                        ? `Resend Code (${cooldown}s)`
                                        : "Resend Code"}
                            </button>
                        </form>

                        {status && (
                            <p style={{ color: "lightgreen", marginTop: "10px" }}>
                                {status}
                            </p>
                        )}
                    </div>
                    <div className="login-image-container">
                        <img src={loginBkgImg} alt="background" />
                    </div>
                </div>
            </main>
        </div>
    );
}