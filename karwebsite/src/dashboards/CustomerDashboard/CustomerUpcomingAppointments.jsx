// src/components/EmployeeSchedule.jsx
import React, { useState } from 'react';

const CustomerUpcomingAppointments = () => {
    const [upcomingAppointments, setUpcomingAppointments] = useState([
        { appointmentDate: '05/01/25', service: 'Brake Repair and Replacement' },
        { appointmentDate: '06/15/25', service: 'Air Conditioning Service' },
        { appointmentDate: '07/10/25', service: 'Oil Change' },
    ]);

    const handleCancel = (index, e) => {
        e.stopPropagation();
        const newTasks = [...upcomingAppointments];
        newTasks.splice(index, 1);
        setUpcomingAppointments(newTasks);
    };

    return (
        <div className="content-section">
            <h1 className="page-title">Upcoming Appointments</h1>
            <div className="appointment-container">
                {upcomingAppointments.length === 0 ? (
                    <div className="no-upcoming-appointments-message">No upcoming appointments found.</div>
                ) : (
                    upcomingAppointments.map((upcomingAppointments, index) => (
                        <div
                            key={index}
                            className="schedule-item"
                            onClick={() => alert(`Showing details for ${upcomingAppointments.date}: ${upcomingAppointments.service}`)}
                        >
                            <div className="appointment-date">{upcomingAppointments.appointmentDate}</div>
                            <div className="appointment-service">{upcomingAppointments.service}</div>
                            <div className="appointment-cancel">
                                <button onClick={(e) => handleCancel(index, e)}>Cancel</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerUpcomingAppointments;