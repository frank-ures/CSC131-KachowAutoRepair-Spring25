// src/Dashboards/CustomerDashboard/CustomerDashboard.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import CustomerSidebar from './CustomerSidebar';
import CustomerOverview from './CustomerOverview';
import CustomerScheduleAnAppointment from './CustomerScheduleAnAppointment';
import CustomerPastAppointments from './CustomerPastAppointments';
import CustomerUpcomingAppointments from './CustomerUpcomingAppointments';
import CustomerWriteAReview from './CustomerWriteAReview';
import Settings from '../../components/Settings';

const CustomerDashboard = () => {
    const [activeSection, setActiveSection] = useState('Overview');
    const [firstName, setFirstName] = useState('CustomerName'); // dynamic in the future

    // switch case for sidebar components
    const renderSection = () => {
        switch (activeSection) {
            case 'Overview':
                return <CustomerOverview />;
            case 'Schedule An Appointment':
                return <CustomerScheduleAnAppointment />;
            case 'Past Appointments':
                return <CustomerPastAppointments />;
            case 'Upcoming Appointments':
                return <CustomerUpcomingAppointments />;
            case 'Write a Review':
                return <CustomerWriteAReview />;
            case 'Settings':
                return <Settings />;
            default:
                return <CustomerOverview />;
        }
    };

    return (
        <DashboardLayout Sidebar={() => (
            <CustomerSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                firstName={firstName}
            />
        )}>
            {renderSection()}
        </DashboardLayout>
    );
};

export default CustomerDashboard;