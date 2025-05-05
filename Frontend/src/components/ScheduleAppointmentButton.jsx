// src/components/ScheduleAppointmentButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../components_CSS/ScheduleAppointmentButton.css';

const ScheduleAppointmentButton = () => {
    return (
        <Link to="/customer" className="schedule-appointment-btn">
            SCHEDULE APPOINTMENT
        </Link>
    );
};

export default ScheduleAppointmentButton;