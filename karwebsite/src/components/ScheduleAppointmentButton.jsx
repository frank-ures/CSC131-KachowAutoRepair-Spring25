// src/components/ScheduleAppointmentButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ScheduleAppointmentButton.css';

const ScheduleAppointmentButton = () => {
    return (
        <Link to="/appointment" className="schedule-appointment-btn">
            SCHEDULE APPOINTMENT
        </Link>
    );
};

export default ScheduleAppointmentButton;