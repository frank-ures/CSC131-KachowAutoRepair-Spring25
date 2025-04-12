import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeSchedule = () => {
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5999/api/appointments');
        setScheduleTasks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments. Please try again later.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Format date and time for display
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  const handleCancel = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        // need an API endpoint to handle cancellation
        // await axios.delete(`/api/appointments/${id}`);
        
        setScheduleTasks(scheduleTasks.filter(task => task._id !== id));
      } catch (err) {
        console.error('Failed to cancel appointment:', err);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  const renderAppointments = () => {
    if (loading) return <div className="loading-message">Loading appointments...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (scheduleTasks.length === 0) return <div className="no-tasks-message">No scheduled appointments found.</div>;

    return scheduleTasks.map((appointment) => (
      <div
        key={appointment._id}
        className="schedule-item"
        onClick={() => showAppointmentDetails(appointment)}
      >
        <div className="schedule-time">
          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
        </div>
        <div className="schedule-name">{appointment.invitee_name}</div>
        <div className="schedule-service">{appointment.event_type}</div>
        <div className="schedule-details">
          {appointment.vehicle_make} {appointment.vehicle_model} ({appointment.vehicle_year})
        </div>
        <div className="schedule-cancel">
          <button onClick={(e) => handleCancel(appointment._id, e)}>Cancel</button>
        </div>
      </div>
    ));
  };

  const showAppointmentDetails = (appointment) => {
    alert(`
      Customer: ${appointment.invitee_name}
      Email: ${appointment.invitee_email}
      Service: ${appointment.event_type}
      Vehicle: ${appointment.vehicle_year} ${appointment.vehicle_make} ${appointment.vehicle_model}
      License Plate: ${appointment.vehicle_license_plate || 'N/A'}
      Date: ${formatDate(appointment.start_time)}
      Time: ${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}
      Additional Info: ${appointment.other_information || 'None provided'}
    `);
  };

  return (
    <div className="content-section">
      <h1 className="page-title">Today's Schedule</h1>
      <div className="schedule-container">
        {renderAppointments()}
      </div>
    </div>
  );
};

export default EmployeeSchedule;



/*
// src/dashboards/EmployeeDashboard/EmployeeSchedule.jsx
import React, { useState } from 'react';

const EmployeeSchedule = () => {
    const [scheduleTasks, setScheduleTasks] = useState([
        { name: 'Alice B.', service: 'Tire Rotation' },
        { name: 'Bob C.', service: 'Engine Diagnostics' },
    ]);

    const handleCancel = (index, e) => {
        e.stopPropagation();
        const newTasks = [...scheduleTasks];
        newTasks.splice(index, 1);
        setScheduleTasks(newTasks);
    };

    return (
        <div className="content-section">
            <h1 className="page-title">Today's Schedule</h1>
            <div className="schedule-container">
                {scheduleTasks.length === 0 ? (
                    <div className="no-tasks-message">No scheduled tasks found.</div>
                ) : (
                    scheduleTasks.map((task, index) => (
                        <div
                            key={index}
                            className="schedule-item"
                            onClick={() => alert(`Showing details for ${task.name}: ${task.service}`)}
                        >
                            <div className="schedule-name">{task.name}</div>
                            <div className="schedule-service">{task.service}</div>
                            <div className="schedule-cancel">
                                <button onClick={(e) => handleCancel(index, e)}>Cancel</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmployeeSchedule;
*/