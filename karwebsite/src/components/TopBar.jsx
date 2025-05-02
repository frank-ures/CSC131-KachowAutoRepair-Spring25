// src/components/TopBar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import karLogo from "./kar-logo.png";

const TopBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rightButtonText, setRightButtonText] = useState("Login");

  // Check if user is logged in on component mount and token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;
    setIsLoggedIn(isAuthenticated);
    if (isAuthenticated) {
      const currentPath = window.location.pathname;
      const isDashboardPath = ["/customer", "/employee", "/admin"].some((path) =>
        currentPath.startsWith(path)
      );
      setRightButtonText(isDashboardPath ? "Logout" : "Account");
    } else {
      setRightButtonText("Login");
    }
  }, [window.location.pathname]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else if (rightButtonText === "Logout") {
      handleLogout(e);
    } else {
      navigate("/role-router");
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5999/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setRightButtonText('Login');
        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Logout failed");
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Network or server error");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <header className="top-bar">
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src={karLogo} alt="Kachow Auto Repair Logo" />
          <span>Kachow Auto Repair</span>
        </Link>
      </div>
      <nav className="top-nav">
        <Link to="/home">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About Us</Link>
        <Link to="/reviews">Reviews</Link>
        <a href="#" onClick={handleButtonClick}>{rightButtonText}</a>
      </nav>
    </header>
  );
};

export default TopBar;
