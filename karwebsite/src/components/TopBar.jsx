// src/components/TopBar.jsx
import React from 'react';
import karLogo from './kar-logo.png';

const TopBar = () => {
    return (
        <header className="top-bar">
            <div className="logo">
                <a href="#" className="logo-link">
                    <img src={karLogo} alt="Kachow Auto Repair Logo" />
                    <span>Kachow Auto Repair</span>
                </a>
            </div>
            <nav className="top-nav">
                <a href="#">Home</a>
                <a href="#">Services</a>
                <a href="#">About Us</a>
                <a href="#">Reviews</a>
            </nav>
        </header>
    );
};

export default TopBar;