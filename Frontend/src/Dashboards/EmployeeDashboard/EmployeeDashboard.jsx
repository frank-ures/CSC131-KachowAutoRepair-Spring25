// src/Dashboards/EmployeeDashboard/EmployeeDashboard.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeOverview from './EmployeeOverview';
import EmployeeSchedule from './EmployeeSchedule';
import EmployeeWorkHistory from './EmployeeWorkHistory';
import EmployeePayroll from './EmployeePayroll';
import Settings from '../../components/Settings';

const EmployeeDashboard = () => {
    const [activeSection, setActiveSection] = useState('Overview');
    const [firstName, setFirstName] = useState('EmployeeName'); // dynamic in the future

    // switch case for sidebar components
    const renderSection = () => {
        switch (activeSection) {
            case 'Overview':
                return <EmployeeOverview />;
            case 'Today’s Schedule':
                return <EmployeeSchedule />;
            case 'Work History':
                return <EmployeeWorkHistory />;
            case 'Payroll':
                return <EmployeePayroll />;
            case 'Settings':
                return <Settings />;
            default:
                return <EmployeeOverview />;
        }
    };

    return (
        <DashboardLayout Sidebar={() => (
            <EmployeeSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                firstName={firstName}
            />
        )}>
            {renderSection()}
        </DashboardLayout>
    );
};

export default EmployeeDashboard;