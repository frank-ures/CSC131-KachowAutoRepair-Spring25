// src/dashboards/CustomerDashboard/CustomerSidebar.jsx
import React from 'react';

const CustomerSidebar = ({ activeSection, setActiveSection, firstName }) => {
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
            <div className="greeting">Hi {firstName}!</div>
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