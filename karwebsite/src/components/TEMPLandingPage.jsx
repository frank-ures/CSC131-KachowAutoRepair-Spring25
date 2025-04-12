// src/components/TEMPLandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from './TopBar';
import './TEMPLandingPage.css';

// each link will lead to the appropriate dashboard
const TEMPLandingPage = () => {
    return (
        <div className="landing-page">
            <TopBar />
            <h1>TEMP ROUTING PAGE FOR TESTING</h1>
            <Link to="/employee" className="landing-link">
                EMPLOYEE DASHBOARD
            </Link>
            <Link to="/admin" className="landing-link">
                ADMIN DASHBOARD
            </Link>
            <Link to="/customer" className="landing-link">
                CUSTOMER DASHBOARD
            </Link>
            <Link to="/home" className="landing-link">
                HOME PAGE
            </Link>
        </div>
    );
};

export default TEMPLandingPage;