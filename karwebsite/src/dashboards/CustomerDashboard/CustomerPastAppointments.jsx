//This should allow the customer when logged in to be able to see their previous appointments.
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerAppointmentHistory = ({ userEmail }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch appointment history when component mounts
    if (userEmail) {
      fetchAppointmentHistory();
    }
  }, [userEmail]);

  const fetchAppointmentHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/appointments/history?email=${encodeURIComponent(userEmail)}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch appointment history:', err);
      setError('Failed to load your appointment history. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in-progress';
      case 'scheduled': return 'status-scheduled';
      default: return 'status-scheduled'; // Default status if none specified
    }
  };

  if (loading) return <div className="loading">Loading your appointment history...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (appointments.length === 0) return <div className="no-appointments">You don't have any previous appointments.</div>;

  return (
    <div className="customer-history-container">
      <h2>Your Appointment History</h2>
      <div className="appointment-list">
        {appointments.map(appointment => (
          <div key={appointment._id} className={`appointment-card ${getStatusClass(appointment.status)}`}>
            <div className="appointment-header">
              <span className="appointment-date">{formatDate(appointment.start_time)}</span>
              <span className={`appointment-status ${getStatusClass(appointment.status)}`}>
                {appointment.status === 'completed' ? 'Completed' : 
                 appointment.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
              </span>
            </div>
            <div className="appointment-details">
              <h3 className="service-type">{appointment.event_type}</h3>
              <div className="time-slot">
                <span className="time">{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
              </div>
              <div className="vehicle-info">
                <span className="vehicle">{appointment.vehicle_year} {appointment.vehicle_make} {appointment.vehicle_model}</span>
                {appointment.vehicle_license_plate && 
                  <span className="license-plate">License: {appointment.vehicle_license_plate}</span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerAppointmentHistory;


/************************************ KEEP THIS CODE UNTIL WE KNOW IT'S NOT NEEDED.
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
*******************************/