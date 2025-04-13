// src/components/TopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import karLogo from './kar-logo.png';

const TopBar = () => {
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
            </nav>
        </header>
    );
};

export default TopBar;