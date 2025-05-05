// src/Dashboards/AdminDashboard/AdminDashboard.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminAppointmentList from './AdminAppointmentList';
import AdminEmployeeList from "./AdminEmployeeList";
import AdminPayrollSettings from "./AdminPayrollSettings";

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('Overview');
    const [firstName, setFirstName] = useState('AdminName'); // will later change based on first name of account pulled from database

    // switch case for sidebar components
    const renderSection = () => {
        switch (activeSection) {
            case 'Overview':
                return <AdminOverview />;
            case 'Appointment List':
                return <AdminAppointmentList />;
            case 'Employee List':
                return <AdminEmployeeList />;
            case 'Payroll Settings':
                return <AdminPayrollSettings />;
            default:
                return <AdminOverview />;
        }
    };

    return (
        <DashboardLayout
            Sidebar={() => <AdminSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                firstName={firstName}/>}
        >
            {renderSection()}
        </DashboardLayout>
    );
};

export default AdminDashboard;