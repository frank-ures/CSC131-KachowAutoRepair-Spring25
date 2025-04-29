// src/components/TopBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import karLogo from './kar-logo.png';

const TopBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in on component mount and token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Convert to boolean
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    try {
      // Get the token to include in the request if needed
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5999/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Clear authentication data
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        
        // Redirect to login page
        navigate('/login');
      } else {
        console.error('Logout failed');
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Network or server error');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/login');
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
        {isLoggedIn ? (
          <a href="#" onClick={handleLogout}>Logout</a>
        ) : (
          <a href="#" onClick={handleLogin}>Login</a>
        )}
      </nav>
    </header>
  );
};

export default TopBar;