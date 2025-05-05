// src/components/DashboardLayout.jsx
import React from 'react';
import TopBar from './TopBar';

const DashboardLayout = ({ Sidebar, children }) => {
    return (
        <div className="dashboard">
            <TopBar />
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;