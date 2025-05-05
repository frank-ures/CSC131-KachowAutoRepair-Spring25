// src/components/Settings.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    return (
        <div className="content-section">
            <h1 className="page-title">Settings</h1>
            <ul className="settings-list">
                <li
                    className="settings-link"
                    onClick={() => navigate('/reset-password/')}
                >
                    Change Password
                </li>
                <li
                    className="settings-link"
                    onClick={() => alert('Implement "Change Email Address" flow here')}
                >
                    Change Email Address
                </li>
            </ul>
        </div>
    );
};

export default Settings;