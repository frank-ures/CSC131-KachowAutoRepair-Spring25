//Mostly Same Code Used to Display Employee Schedule
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeSchedule = () => {
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    fetchAppointmentsForDate(selectedDate);
    
    // Updates the display date
    setDisplayDate(formatDisplayDate(selectedDate));
    
    // Refreshes data every 5 minutes if viewing today's schedule
    const isToday = isSameDay(selectedDate, new Date());
    let intervalId;
    
    if (isToday) {
      intervalId = setInterval(() => fetchAppointmentsForDate(selectedDate), 5 * 60 * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedDate]);

  const fetchAppointmentsForDate = async (date) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5999/api/appointments');
      
      // Filters for appointments on the selected date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      const filteredAppointments = response.data.filter(appointment => {
        const appointmentDate = new Date(appointment.start_time);
        return appointmentDate >= startOfDay && appointmentDate < endOfDay;
      });
      
      // Sort by start time
      filteredAppointments.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      
      setScheduleTasks(filteredAppointments);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again later.');
      setLoading(false);
    }
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };


  // Format date for display
  const formatDisplayDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (isSameDay(date, today)) {
      return 'Today';
    } else if (isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };


  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  // Navigate to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Format time for display
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };



  // Get current appointment
  const getCurrentAppointment = () => {
    const now = new Date();
    return scheduleTasks.find(appointment => {
      const startTime = new Date(appointment.start_time);
      const endTime = new Date(appointment.end_time);
      return now >= startTime && now <= endTime;
    });
  };

  const renderAppointments = () => {
    if (loading) return <div className="loading-message">Loading appointments...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (scheduleTasks.length === 0) return <div className="no-tasks-message">No appointments scheduled for this day.</div>;
    
    const currentAppointment = isSameDay(selectedDate, new Date()) ? getCurrentAppointment() : null;
    
    return scheduleTasks.map((appointment) => {
      // Check if this appointment is currently active
      const isCurrentAppointment = currentAppointment && currentAppointment._id === appointment._id;
      
      return (
        <div
          key={appointment._id}
          className={`schedule-item ${isCurrentAppointment ? 'current-appointment' : ''}`}
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
          
        </div>
      );
    });
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
      <div className="schedule-header">
        <h1 className="page-title">Schedule</h1>
        <div className="date-navigation">
          <button 
            className="nav-button" 
            onClick={goToPreviousDay}
            aria-label="Previous day"
          >
            &lt;
          </button>
          <div className="date-display">
            <span className="selected-date">{displayDate}</span>
            <span className="date-details">
              {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button 
            className="nav-button" 
            onClick={goToNextDay}
            aria-label="Next day"
          >
            &gt;
          </button>
          {!isSameDay(selectedDate, new Date()) && (
            <button 
              className="today-button" 
              onClick={goToToday}
            >
              Today
            </button>
          )}
        </div>
      </div>
      <div className="schedule-container">
        {renderAppointments()}
      </div>
    </div>
  );
};

export default EmployeeSchedule;

