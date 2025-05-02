import React, { useState, useEffect } from 'react';
import axios from 'axios';


// CustomerHistoryModal component
const CustomerHistoryModal = ({ customer, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && customer) {
      fetchCustomerHistory();
    }
  }, [isOpen, customer]);

  const fetchCustomerHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5999/api/appointments/history?email=${encodeURIComponent(customer.email)}`);
      setHistory(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch customer history:', err);
      setError('Failed to load appointment history. Please try again later.');
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
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content customer-history-modal">
        <div className="modal-header">
          <h2>Appointment History: {customer.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="loading-message">Loading appointment history...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : history.length === 0 ? (
            <div className="no-history-message">No previous appointments found for this customer.</div>
          ) : (
            <div className="history-list">
              {history.map(appointment => (
                <div key={appointment._id} className={`history-item ${getStatusClass(appointment.status)}`}>
                  <div className="history-date">
                    <strong>{formatDate(appointment.start_time)}</strong>
                    <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                  </div>
                  <div className="history-service">{appointment.event_type}</div>
                  <div className="history-vehicle">
                    {appointment.vehicle_year} {appointment.vehicle_make} {appointment.vehicle_model}
                  </div>
                  <div className="history-status">
                    <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                      {appointment.status === 'in_progress' ? 'In Progress' : 
                       appointment.status === 'completed' ? 'Completed' : 'Scheduled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const EmployeeSchedule = () => {
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');
  
  // state for customer history modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5999/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('API Response:', response.data); // Debugging by logging all appointments
      
      // Creates a date object that represents the start of the selected day in local time
      const selectedDateLocal = new Date(date);
      selectedDateLocal.setHours(0, 0, 0, 0);
      const selectedDateStr = selectedDateLocal.toDateString();
      
      console.log('Selected date for filtering:', selectedDateStr); // Debugging by logging the selected date
      
      const filteredAppointments = response.data.filter(appointment => {
        const appointmentDate = new Date(appointment.start_time);
        return (
          appointmentDate.getFullYear() === date.getFullYear() &&
          appointmentDate.getMonth() === date.getMonth() &&
          appointmentDate.getDate() === date.getDate()
        );
      });
      /*
      const filteredAppointments = response.data.filter(appointment => {
        // Creates a date object from the appointment's start time in local time
        const appointmentDate = new Date(appointment.start_time);
        const appointmentDateStr = appointmentDate.toDateString();
        
        console.log(`Appointment ${appointment._id} date: ${appointmentDateStr}`); // Debugging by logging each appointment date
        
        // Compares date strings 
        return appointmentDateStr === selectedDateStr;
      });
      */
      console.log('Filtered appointments:', filteredAppointments); // Debugging by logging filtered results
      
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
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (isSameDay(date, today)) {
      return 'Today';
    } else if (isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    } else if (isSameDay(date, yesterday)) {
      return 'Yesterday';
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

  

  // Handle starting an appointment
  const handleStartAppointment = async (appointment, e) => {
    e.stopPropagation();
    try {
      const response = await axios.post('http://localhost:5999/api/appointments/start', {
        appointmentId: appointment._id,
        status: 'in_progress'
      });
      
      if (response.status === 200) {
        // Updates the local state to reflect the change
        const updatedTasks = scheduleTasks.map(task => 
          task._id === appointment._id ? { ...task, status: 'in_progress' } : task
        );
        setScheduleTasks(updatedTasks);
        alert(`Appointment with ${appointment.invitee_name} has been started.`);
      }
    } catch (err) {
      console.error('Failed to start appointment:', err);
      alert('Failed to start appointment. Please try again.');
    }
  };

  // Handle completing an appointment
  const handleCompleteAppointment = async (appointment, e) => {
    e.stopPropagation();
    try {
      const response = await axios.post('http://localhost:5999/api/appointments/complete', {
        appointmentId: appointment._id,
        status: 'completed'
      });
      
      if (response.status === 200) {
        // Update the local state to reflect the change
        const updatedTasks = scheduleTasks.map(task => 
          task._id === appointment._id ? { ...task, status: 'completed' } : task
        );
        setScheduleTasks(updatedTasks);
        alert(`Appointment with ${appointment.invitee_name} has been completed.`);
      }
    } catch (err) {
      console.error('Failed to complete appointment:', err);
      alert('Failed to complete appointment. Please try again.');
    }
  };

  // Handle viewing customer history
  const handleViewHistory = (appointment, e) => {
    e.stopPropagation();
    setSelectedCustomer({
      name: appointment.invitee_name,
      email: appointment.invitee_email
    });
    setHistoryModalOpen(true);
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
      
      // Get status for showing appropriate buttons
      const status = appointment.status || 'scheduled';
      
      return (
        <div
          key={appointment._id}
          className={`schedule-item ${isCurrentAppointment ? 'current-appointment' : ''} status-${status}`}
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
          <div className="schedule-actions">
            {status === 'scheduled' && (
              <button 
                className="start-button"
                onClick={(e) => handleStartAppointment(appointment, e)}
              >
                Start
              </button>
            )}
            {status === 'in_progress' && (
              <button 
                className="complete-button"
                onClick={(e) => handleCompleteAppointment(appointment, e)}
              >
                Complete
              </button>
            )}
            {status === 'completed' && (
              <div className="status-indicator completed">Completed</div>
            )}
            {/* History Button */}
            <button 
              className="history-button"
              onClick={(e) => handleViewHistory(appointment, e)}
            >
              View History
            </button>
          </div>
        </div>
      );
    });
  };

  const showAppointmentDetails = (appointment) => {
    // Get status text for display
    let statusText = 'Scheduled';
    if (appointment.status === 'in_progress') statusText = 'In Progress';
    if (appointment.status === 'completed') statusText = 'Completed';
    
    alert(`
      Customer: ${appointment.invitee_name}
      Email: ${appointment.invitee_email}
      Service: ${appointment.event_type}
      Vehicle: ${appointment.vehicle_year} ${appointment.vehicle_make} ${appointment.vehicle_model}
      License Plate: ${appointment.vehicle_license_plate || 'N/A'}
      Date: ${formatDate(appointment.start_time)}
      Time: ${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}
      Status: ${statusText}
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

      {/* Customer History Modal */}
      {selectedCustomer && (
        <CustomerHistoryModal 
          customer={selectedCustomer}
          isOpen={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeSchedule;

