// src/dashboards/CustomerDashboard/CustomerPastAppointments.jsx
import React, { useState } from 'react';
import downloadIcon from '../../components/download-icon.png';

const CustomerPastAppointments = () => {
    const [pastAppointments] = useState([
        { appointmentDate: '08/01/23', service: 'Brake Repair and Replacement' },
        { appointmentDate: '07/15/23', service: 'Air Conditioning Service' },
        { appointmentDate: '06/10/23', service: 'Oil Change' },
    ]);

    return (
        <div className="content-section">
            <h1 className="page-title">Past Appointments</h1>
            {/* Renamed container class */}
            <div className="past-appointments-container">
                {pastAppointments.length === 0 ? (
                    <div className="no-tasks-message">No previous appointments found.</div>
                ) : (
                    pastAppointments.map((task, index) => (
                        <div
                            key={index}
                            className="appointment-item"
                            onClick={() =>
                                alert(`Showing details for ${task.appointmentDate}: ${task.service}`)
                            }
                        >
                            <div className="appointment-date">{task.appointmentDate}</div>
                            <div className="appointment-service">{task.service}</div>
                            <div className="history-download">
                                <img
                                    src={downloadIcon}
                                    alt="Download"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Download details for ${task.appointmentDate}'s ${task.service}`);
                                    }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerPastAppointments;