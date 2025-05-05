// src/Dashboards/EmployeeDashboard/EmployeeSidebar.jsx
import React from 'react';
import { useAuth } from "../../context/AuthContext";

const EmployeeSidebar = ({ activeSection, setActiveSection, firstName }) => {
    const { currentUser, authFetch } = useAuth();
    const navItems = [
        'Overview',
        'Today’s Schedule',
        'Work History',
        'Payroll',
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
        </aside>
    );
};

export default EmployeeSidebar;