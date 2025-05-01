import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import carGarage from '../components/car-garage.jpg'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailRegex)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Please enter your password');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:5999/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        // Redirect based on role if provided
        if (data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'mechanic') {
          navigate('/employee');
        } else if (data.role === 'customer') {
          navigate('/customer');
        } else {
          navigate('/');
        }
      } else {
        console.error("Login failed:", data);
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Network or server error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      loginUser();
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
              />
              {emailError && <span className="login-error-message">{emailError}</span>}

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                placeholder="Enter Password Here..."
              />
              {passwordError && <span className="login-error-message">{passwordError}</span>}

              <button type="submit">Sign In</button>
            </form>
            <a href="/forgotPassword" className="login-link">Forgot your password?</a>
            <a href="/register" className="login-link">Don't have an account? Sign Up</a>
          </div>
          <div className="login-image-container">
            <img src={carGarage} alt="Race Car in Garage" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;