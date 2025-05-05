// src/Dashboards/CustomerDashboard/CustomerSidebar.jsx
import React from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const CustomerSidebar = ({ activeSection, setActiveSection, }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    //firstName }) => {
    //const { currentUser, authFetch } = useAuth();
    const navItems = [
        'Overview',
        'Schedule An Appointment',
        'Past Appointments',
        'Upcoming Appointments',
        'Write a Review',
        'Settings'
    ];

    /******************* */
    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate('/login');
        }
    };


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

export default CustomerSidebar;