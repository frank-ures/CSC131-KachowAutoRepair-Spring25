import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import loginBkgImg from "../components/login-bkg-img.jpg";
import "../components/Login.css";
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requireMfa, setRequireMfa] = useState(false);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailRegex)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Please enter your password");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If we're submitting the MFA code
    if (requireMfa) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5999/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, mfaCode }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Login successful:", data);
          localStorage.setItem("token", data.token);
          
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          
          // Navigate based on role
          if (data.role === "admin") {
            navigate("/admin");
          } else if (data.role === "mechanic") {
            navigate("/employee");
          } else if (data.role === "customer") {
            navigate("/customer");
          } else {
            navigate("/");
          }
        } else {
          console.error("MFA verification failed:", data);
          alert(data.error || "Verification failed");
        }
      } catch (error) {
        console.error("Error during MFA verification:", error);
        alert("Network or server error");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Normal login flow
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
        // Use fetch directly for more control over the MFA process
        const response = await fetch("http://localhost:5999/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Check if MFA is required
          if (data.requireMfa) {
            setRequireMfa(true);
            setUserId(data.userId);
            alert("A verification code has been sent to your email. Please check your inbox and enter the code below.");
            setIsLoading(false);
            return;
          }

          // Normal login success
          console.log("Login successful:", data);
          localStorage.setItem("token", data.token);
          
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          
          // Navigate based on role
          if (data.role === "admin") {
            navigate("/admin");
          } else if (data.role === "mechanic") {
            navigate("/employee");
          } else if (data.role === "customer") {
            navigate("/customer");
          } else {
            navigate("/");
          }
        } else {
          console.error("Login failed:", data);
          alert(data.error || "Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("Network or server error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <TopBar />
      </header>
      <main className="login-main">
        <div className="login-container-wrapper">
          <div className="login-form-container">
            <h2>Welcome Back!</h2>
            <p>Please enter your login credentials</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="email-field">Email Address</label>
              <input
                type="email"
                id="email-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                spellCheck="false"
                placeholder="Enter Email Address Here..."
                disabled={requireMfa}
              />
              {emailError && (
                <span className="login-error-message">{emailError}</span>
              )}

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                placeholder="Enter Password Here..."
                disabled={requireMfa}
              />
              {passwordError && (
                <span className="login-error-message">{passwordError}</span>
              )}

              {requireMfa && (
                <>
                  <label htmlFor="mfa-code">Verification Code</label>
                  <input
                    type="text"
                    id="mfa-code"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="Enter verification code from your email"
                    autoFocus
                  />
                </>
              )}

              <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing In..." : requireMfa ? "Verify Code" : "Sign In"}
              </button>
            </form>
            {!requireMfa && (
              <>
                <a href="/forgotPassword" className="login-link">
                  Forgot your password?
                </a>
                <a href="/register" className="login-link">
                  Don't have an account? Sign Up
                </a>
              </>
            )}
          </div>
          <div className="login-image-container">
            <img src={loginBkgImg} alt="Login Background" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;