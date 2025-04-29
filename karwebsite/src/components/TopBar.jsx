// src/components/TopBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import karLogo from './kar-logo.png';

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    try {
      // Get the token to include in the request if needed
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5999/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include if your API requires authentication
        }
      });
      
      if (response.ok) {
        // Clear authentication data
        localStorage.removeItem('token');
        
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
        <a href="#" onClick={handleLogout}>Logout</a>
      </nav>
    </header>
  );
};

export default TopBar;