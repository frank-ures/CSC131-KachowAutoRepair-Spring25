// src/dashboards/AdminDashboard/AdminSidebar.jsx
import React from 'react';

const AdminSidebar = ({ activeSection, setActiveSection, firstName }) => {
    const navItems = [
        'Overview',
        'Appointment List',
        'Employee List',
        'Payroll Settings'
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

export default AdminSidebar;