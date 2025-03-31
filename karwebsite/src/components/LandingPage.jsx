// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from './TopBar';
import './LandingPage.css';

// each link will lead to the apprioriate dashboard
const LandingPage = () => {
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
        </div>
    );
};

export default LandingPage;