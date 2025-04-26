// src/dashboards/CustomerDashboard/CustomerSidebar.jsx
import React from 'react';
import { useAuth } from "../../context/AuthContext";

const CustomerSidebar = ({ activeSection, setActiveSection, firstName }) => {
    const { currentUser, authFetch } = useAuth();
    const navItems = [
        'Overview',
        'Schedule An Appointment',
        'Past Appointments',
        'Upcoming Appointments',
        'Write a Review',
        'Settings'
    ];

    return (
        <aside className="sidebar">
            <div className="greeting">Hi {currentUser.firstName}!</div>
            <nav className="side-nav">
                <ul>
                    {navItems.map((item) => (
                        <li
                            key={item}
                            className={`nav-item ${activeSection === item ? 'active' : ''}`}
                            onClick={() => setActiveSection(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="logout">Log out</div>
        </aside>
    );
};

export default CustomerSidebar;