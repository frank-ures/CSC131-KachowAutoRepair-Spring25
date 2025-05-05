import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import loginBkgImg from "../images/login-bkg-img.jpg";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifyPasswordError, setVerifyPasswordError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

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

  const validateVerifyPassword = () => {
    if (!verifyPassword) {
      setVerifyPasswordError("Please enter your password again");
      return false;
    }
    setVerifyPasswordError("");
    return true;
  };

  const comparePasswords = () => {
    if (password !== verifyPassword) {
      setVerifyPasswordError("Passwords must match");
      return false;
    }
    setVerifyPasswordError("");
    return true;
  };

  const registerUser = async () => {
    try {
      const response = await fetch("http://localhost:5999/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
          role: "customer",
          hourlyWage: 0,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        // Check if we need email verification
        if (data.userId) {
          setUserId(data.userId);
          setShowVerification(true);
          alert("A verification code has been sent to your email. Please check your inbox and enter the code below to complete registration.");
        } else {
          navigate("/login");
        }
      } else {
        console.error("Registration failed:", data);
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Network or server error");
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await fetch("http://localhost:5999/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          code: verificationCode
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Email verified successfully! You can now log in.");
        navigate("/login");
      } else {
        console.error("Verification failed:", data);
        alert(data.error || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      alert("Network or server error");
    }
  };

  const resendVerification = async () => {
    try {
      const response = await fetch("http://localhost:5999/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("A new verification code has been sent to your email.");
      } else {
        console.error("Failed to resend verification:", data);
        alert(data.error || "Failed to resend verification code.");
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      alert("Network or server error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If we're in verification mode, verify the email
    if (showVerification) {
      if (verificationCode.trim()) {
        verifyEmail();
      } else {
        alert("Please enter the verification code from your email.");
      }
      return;
    }

    // Normal registration flow
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isVerifyPasswordValid = validateVerifyPassword();
    const areEqual = comparePasswords();

    if (isEmailValid && isPasswordValid && isVerifyPasswordValid && areEqual) {
      registerUser();
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
            {!showVerification ? (
              <>
                <h2>Create an Account</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                  <label htmlFor="first-name-field">First Name</label>
                  <input
                    type="text"
                    id="first-name-field"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    spellCheck="false"
                    placeholder="Enter First Name"
                  />

                  <label htmlFor="last-name-field">Last Name</label>
                  <input
                    type="text"
                    id="last-name-field"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    spellCheck="false"
                    placeholder="Enter Last Name"
                  />

                  <label htmlFor="username-field">Username</label>
                  <input
                    type="text"
                    id="username-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    spellCheck="false"
                    placeholder="Enter Username"
                  />

                  <label htmlFor="email-field">Email Address</label>
                  <input
                    type="email"
                    id="email-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                    spellCheck="false"
                    placeholder="Enter Email Address"
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
                    placeholder="Enter Password"
                  />
                  {passwordError && (
                    <span className="login-error-message">{passwordError}</span>
                  )}

                  <label htmlFor="verify-password">Verify Password</label>
                  <input
                    type="password"
                    id="verify-password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    onBlur={validateVerifyPassword}
                    placeholder="Enter Password Again"
                  />
                  {verifyPasswordError && (
                    <span className="login-error-message">
                      {verifyPasswordError}
                    </span>
                  )}

                  <button type="submit">Register</button>
                </form>
                <a href="/Frontend/src/FormPages/Login" className="login-link">
                  Already have an account? Sign In
                </a>
              </>
            ) : (
              <>
                <h2>Verify Your Email</h2>
                <p>Please check your email for a verification code and enter it below.</p>
                <form className="login-form" onSubmit={handleSubmit}>
                  <label htmlFor="verification-code">Verification Code</label>
                  <input
                    type="text"
                    id="verification-code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    autoFocus
                  />

                  <button type="submit">Verify Email</button>
                  <button
                    type="button"
                    onClick={resendVerification}
                    style={{ marginTop: '10px', backgroundColor: '#dc2626', color: '#FFFF00' }}
                  >
                    Resend Code
                  </button>
                </form>
                <a href="/Frontend/src/FormPages/Login" className="login-link">
                  Back to Login
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

export default RegisterPage;