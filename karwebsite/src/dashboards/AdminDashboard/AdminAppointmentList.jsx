import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    fetchAppointmentsForDate(selectedDate);
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
      
      // Format date as YYYY-MM-DD for filtering
      const formattedDate = date.toISOString().split('T')[0];
      

      
      // Get all appointments and filter on client side based on your current API
      const response = await axios.get('http://localhost:5999/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      
      // Filter appointments for the selected date
      const filteredAppointments = response.data.filter(appointment => {
        const appointmentDate = new Date(appointment.start_time);
        return isSameDay(appointmentDate, date);
      });
      
      // Sort appointments by start time
      const sortedAppointments = filteredAppointments.sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
      );
      
      setAppointments(sortedAppointments);
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
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Invalid';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Error';
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Invalid';
      return date.toLocaleDateString();
    } catch (e) {
      return 'Error';
    }
  };

  // Get current appointment
  const getCurrentAppointment = () => {
    const now = new Date();
    
    return appointments.find(appointment => {
      const startTime = new Date(appointment.start_time);
      const endTime = new Date(appointment.end_time);
      return now >= startTime && now <= endTime;
    });
  };

  const renderAppointments = () => {
    if (loading) return <div className="loading-message">Loading appointments...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (appointments.length === 0) return <div className="no-tasks-message">No appointments scheduled for this day.</div>;
    
    const currentAppointment = isSameDay(selectedDate, new Date()) ? getCurrentAppointment() : null;
    
    return appointments.map((appointment) => {
      // Check if this appointment is currently active
      const isCurrentAppointment = currentAppointment && currentAppointment._id === appointment._id;
      
      // Create vehicle info string if available
      const vehicleInfo = [
        appointment.vehicle_year,
        appointment.vehicle_make,
        appointment.vehicle_model
      ].filter(Boolean).join(' ');
      
      return (
        <div
          key={appointment._id}
          className={`schedule-item ${isCurrentAppointment ? 'current-appointment' : ''}`}
          onClick={() => showAppointmentDetails(appointment)}
        >
          <div className="schedule-time">
            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
          </div>
          <div className="schedule-name">{appointment.invitee_name || 'Unknown'}</div>
          <div className="schedule-service">{appointment.event_type || 'Service not specified'}</div>
          {vehicleInfo && (
            <div className="schedule-details">{vehicleInfo}</div>
          )}
          {appointment.status && (
            <div className={`schedule-status status-${appointment.status}`}>
              {appointment.status.replace('_', ' ')}
            </div>
          )}
        </div>
      );
    });
  };

  const showAppointmentDetails = (appointment) => {
    // Create vehicle info string if available
    const vehicleInfo = [
      appointment.vehicle_year,
      appointment.vehicle_make,
      appointment.vehicle_model
    ].filter(Boolean).join(' ');
    
    // Create alert with all available information
    const detailsText = `
      Customer: ${appointment.invitee_name || 'N/A'}
      Email: ${appointment.invitee_email || 'N/A'}
      Service: ${appointment.event_type || 'N/A'}
      Vehicle: ${vehicleInfo || 'N/A'}
      License Plate: ${appointment.vehicle_license_plate || 'N/A'}
      Date: ${formatDate(appointment.start_time)}
      Time: ${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}
      Additional Info: ${appointment.other_information || 'None provided'}
      Status: ${appointment.status || 'scheduled'}
    `;
    
    // For debugging
    console.log('Appointment details:', appointment);
    
    alert(detailsText);
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

export default AdminAppointmentList;




/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAppointmentList = () => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      
      console.log('API Response:', response.data);
      console.log('Token (first few chars):', token ? token.substring(0, 10) + '...' : 'missing');
      console.log('Raw appointment data sample:', response.data[0]);
      
      // Filters for appointments on the selected date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      console.log('date filtering - start of day:', startOfDay);
      console.log('date filtering - end of day:', endOfDay);
      
      // Find the correct date property from the first appointment
      const firstAppointment = response.data[0] || {};
      
      // Update the array of possible date fields to prioritize start_time and end_time based on your MongoDB structure
      const dateFields = ['start_time', 'end_time', 'startTime', 'endTime', 'appointmentDate', 'date', 'scheduled_time', 'scheduledTime', 'timeStarted', 'timeComplete'];
      
      // Try to find which date field exists in the appointment data
      let dateField = null;
      for (const field of dateFields) {
        if (firstAppointment[field]) {
          dateField = field;
          console.log('Found date field:', dateField, 'with value:', firstAppointment[field]);
          break;
        }
      }
      
      // If no date field was found, log the full appointment structure
      if (!dateField) {
        console.log('Could not find date field. Full appointment structure:', firstAppointment);
        setError('Could not determine appointment date field');
        setLoading(false);
        return;
      }
      
      console.log('all appointments with dates:');
      // Use the found date field for filtering
      const filteredAppts = response.data.filter(appointment => {
        const appointmentDate = appointment[dateField] ? new Date(appointment[dateField]) : null;
        const isInRange = appointmentDate && 
                          appointmentDate >= startOfDay && 
                          appointmentDate < endOfDay;
        
        // Debug log
        console.log(`Appointment ${appointment._id}:`, {
          id: appointment._id,
          name: appointment.invitee_name || appointment.customer_name || 'Unknown',
          originalStartTime: appointment[dateField],
          parsedDate: appointmentDate,
          inRange: isInRange
        });
        
        return isInRange;
      });
      
      // Sort by the found date field
      filteredAppts.sort((a, b) => 
        new Date(a[dateField]) - new Date(b[dateField])
      );
      
      console.log('filtered appointments:', filteredAppts.length, filteredAppts);
      
      setScheduleTasks(filteredAppts);
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

  // Format time for display - made more robust
  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Invalid';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Error';
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Invalid';
      return date.toLocaleDateString();
    } catch (e) {
      return 'Error';
    }
  };

  // Helper function to find the first existing field from a list of possibilities
  const findField = (obj, possibleFields) => {
    if (!obj) return null;
    for (const field of possibleFields) {
      if (obj[field] !== undefined) {
        return field;
      }
    }
    return possibleFields[0]; // Return first option as fallback
  };

  // Get current appointment - also more robust
  const getCurrentAppointment = () => {
    const now = new Date();
    // Updated fields list to prioritize start_time and end_time based on your MongoDB document structure
    const dateFields = ['start_time', 'end_time', 'startTime', 'endTime', 'appointmentDate', 'date', 'scheduled_time', 'scheduledTime', 'timeStarted', 'timeComplete'];
    
    // Find the first date field that exists in our appointments
    let startField = null;
    let endField = null;
    
    if (scheduleTasks.length > 0) {
      // Check for start_time and end_time first (based on your MongoDB structure)
      if (scheduleTasks[0].start_time) {
        startField = 'start_time';
        if (scheduleTasks[0].end_time) {
          endField = 'end_time';
        }
      }
      
      // If we didn't find the specific fields, try the others
      if (!startField) {
        for (const field of dateFields) {
          if (scheduleTasks[0][field]) {
            startField = field;
            // Try to find corresponding end field
            const possibleEndFields = [
              `end_${field}`, 
              `${field.replace('start', 'end')}`,
              field.replace('start', 'end'),
              'end_time', 
              'endTime',
              'timeComplete'
            ];
            
            for (const endF of possibleEndFields) {
              if (scheduleTasks[0][endF]) {
                endField = endF;
                break;
              }
            }
            break;
          }
        }
      }
    }
    
    // If we found both fields, proceed with finding current appointment
    if (startField && endField) {
      return scheduleTasks.find(appointment => {
        const startTime = new Date(appointment[startField]);
        const endTime = new Date(appointment[endField]);
        return now >= startTime && now <= endTime;
      });
    }
    
    // Fallback to hard-coded fields if we couldn't determine them
    return scheduleTasks.find(appointment => {
      // Try start_time/end_time first as fallback (based on your MongoDB structure)
      if (appointment.start_time && appointment.end_time) {
        const startTime = new Date(appointment.start_time);
        const endTime = new Date(appointment.end_time);
        return now >= startTime && now <= endTime;
      }
      
      // Fall back to original fields
      const startTime = appointment.start_time ? new Date(appointment.start_time) : null;
      const endTime = appointment.end_time ? new Date(appointment.end_time) : null;
      return startTime && endTime && now >= startTime && now <= endTime;
    });
  };

  const renderAppointments = () => {
    if (loading) return <div className="loading-message">Loading appointments...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (scheduleTasks.length === 0) return <div className="no-tasks-message">No appointments scheduled for this day.</div>;
    
    const currentAppointment = isSameDay(selectedDate, new Date()) ? getCurrentAppointment() : null;
    
    // Find the correct fields to display from the first appointment
    const firstAppointment = scheduleTasks[0];
    const nameField = findField(firstAppointment, ['invitee_name', 'customer_name', 'name', 'clientName']);
    const serviceField = findField(firstAppointment, ['event_type', 'service', 'serviceType', 'appointment_type']);
    const makeField = findField(firstAppointment, ['vehicle_make', 'make', 'car_make']);
    const modelField = findField(firstAppointment, ['vehicle_model', 'model', 'car_model']);
    const yearField = findField(firstAppointment, ['vehicle_year', 'year', 'car_year']);
    // Updated to prioritize start_time and end_time based on your MongoDB structure
    const startTimeField = findField(firstAppointment, ['start_time', 'startTime', 'appointmentTime', 'time', 'timeStarted']);
    const endTimeField = findField(firstAppointment, ['end_time', 'endTime', 'appointmentEndTime', 'timeComplete']);
    
    console.log('Using fields:', { nameField, serviceField, startTimeField, endTimeField });
    
    return scheduleTasks.map((appointment) => {
      // Check if this appointment is currently active
      const isCurrentAppointment = currentAppointment && currentAppointment._id === appointment._id;
      
      // Safely access fields with fallbacks
      const name = appointment[nameField] || 'Unknown';
      const service = appointment[serviceField] || 'Service not specified';
      const make = appointment[makeField] || '';
      const model = appointment[modelField] || '';
      const year = appointment[yearField] || '';
      const vehicleInfo = [year, make, model].filter(Boolean).join(' ');
      
      return (
        <div
          key={appointment._id}
          className={`schedule-item ${isCurrentAppointment ? 'current-appointment' : ''}`}
          onClick={() => showAppointmentDetails(appointment)}
        >
          <div className="schedule-time">
            {formatTime(appointment[startTimeField])} - {formatTime(appointment[endTimeField])}
          </div>
          <div className="schedule-name">{name}</div>
          <div className="schedule-service">{service}</div>
          {vehicleInfo && (
            <div className="schedule-details">{vehicleInfo}</div>
          )}
        </div>
      );
    });
  };

  const showAppointmentDetails = (appointment) => {
    // Updated field lists based on your actual MongoDB structure
    const nameField = findField(appointment, ['invitee_name', 'customer_name', 'name', 'clientName']);
    const emailField = findField(appointment, ['invitee_email', 'email', 'customer_email', 'clientEmail']);
    const serviceField = findField(appointment, ['event_type', 'service', 'serviceType', 'appointment_type']);
    const makeField = findField(appointment, ['vehicle_make', 'make', 'car_make']);
    const modelField = findField(appointment, ['vehicle_model', 'model', 'car_model']);
    const yearField = findField(appointment, ['vehicle_year', 'year', 'car_year']);
    const licensePlateField = findField(appointment, ['vehicle_license_plate', 'license_plate', 'licensePlate']);
    const startTimeField = findField(appointment, ['start_time', 'startTime', 'appointmentTime', 'time', 'timeStarted']);
    const endTimeField = findField(appointment, ['end_time', 'endTime', 'appointmentEndTime', 'timeComplete']);
    const infoField = findField(appointment, ['other_information', 'notes', 'additional_info', 'comments']);
    
    // Create alert with all available information
    const detailsText = `
      Customer: ${appointment[nameField] || 'N/A'}
      Email: ${appointment[emailField] || 'N/A'}
      Service: ${appointment[serviceField] || 'N/A'}
      Vehicle: ${[appointment[yearField], appointment[makeField], appointment[modelField]].filter(Boolean).join(' ') || 'N/A'}
      License Plate: ${appointment[licensePlateField] || 'N/A'}
      Date: ${formatDate(appointment[startTimeField])}
      Time: ${formatTime(appointment[startTimeField])} - ${formatTime(appointment[endTimeField])}
      Additional Info: ${appointment[infoField] || 'None provided'}
    `;
    
    // For debugging
    console.log('Appointment details:', appointment);
    
    alert(detailsText);
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

export default AdminAppointmentList;
*/








/****************************************************** 
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
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5999/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

/***************************************************** 
      console.log('API Response:', response.data);
      console.log('Token (first few chars):', token ? token.substring(0, 10) + '...' : 'missing');
      
      // Filters for appointments on the selected date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      /****************debugging 
      console.log('date filtering - start of day:', startOfDay);
      console.log('date filtering - end of day:', endOfDay);
      
      const filteredAppointments = response.data.filter(appointment => {

        console.log('all apointments with dates:');
        response.data.forEach((appointment, index) =>{
          const appointmentDate = new Date(appointment.start_time);
          console.log(`Appoingment ${index}:`, {
            id: appointment._id,
            name: appointment.invitee_name,
            originalStartTime: appointment.start_time,
            parsedDate: appointmentDate,
            inRange: appointmentDate >= startOfDay && appointmentDate < endOfDay
          });
        });

      })
        /*
        const appointmentDate = new Date(appointment.start_time);
        return appointmentDate >= startOfDay && appointmentDate < endOfDay;
        */
      //});
      
      // Sort by start time
      //filteredAppointments.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      
      //setScheduleTasks(filteredAppointments);

      /********** 
      console.log('filtered apointments:', filteredAppointments.length, filteredAppointments);



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
****************************/







/*********************************
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
    
    // Update the display date
    setDisplayDate(formatDisplayDate(selectedDate));
    
    // Refresh data every 5 minutes if viewing today's schedule
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
      //const response = await axios.get('http://localhost:5999/api/appointments');
      console.log('API Response:', response.data); // Debug: Log all appointments
      
      // Create a date object that represents the start of the selected day in local time
      const selectedDateLocal = new Date(date);
      selectedDateLocal.setHours(0, 0, 0, 0);
      const selectedDateStr = selectedDateLocal.toDateString();
      
      console.log('Selected date for filtering:', selectedDateStr); // Debug: Log the selected date
      
      const filteredAppointments = response.data.filter(appointment => {
        // Create a date object from the appointment's start time in local time
        const appointmentDate = new Date(appointment.start_time);
        const appointmentDateStr = appointmentDate.toDateString();
        
        console.log(`Appointment ${appointment._id} date: ${appointmentDateStr}`); // Debug: Log each appointment date
        
        // Compare date strings (ignoring time)
        return appointmentDateStr === selectedDateStr;
      });
      
      console.log('Filtered appointments:', filteredAppointments); // Debug: Log filtered results
      
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

  // Handle starting an appointment
  const handleStartAppointment = async (appointment, e) => {
    e.stopPropagation();
    try {
      const response = await axios.post('http://localhost:5999/api/appointments/start', {
        appointmentId: appointment._id
      });
      
      if (response.status === 200) {
        // Update the local state to reflect the change
        const updatedTasks = scheduleTasks.map(task => 
          task._id === appointment._id ? { ...task, status: 'in_progress' } : task
        );
        setScheduleTasks(updatedTasks);
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
        appointmentId: appointment._id
      });
      
      if (response.status === 200) {
        // Update the local state to reflect the change
        const updatedTasks = scheduleTasks.map(task => 
          task._id === appointment._id ? { ...task, status: 'completed' } : task
        );
        setScheduleTasks(updatedTasks);
      }
    } catch (err) {
      console.error('Failed to complete appointment:', err);
      alert('Failed to complete appointment. Please try again.');
    }
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
          {isCurrentAppointment && <div className="current-indicator">CURRENT</div>}
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
            <button 
              className="cancel-button"
              onClick={(e) => handleCancel(appointment._id, e)}
            >
              Cancel
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
    </div>
  );
};

export default EmployeeSchedule;
******************************/

/*import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeSchedule = () => {
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');
  const [debug, setDebug] = useState(null); // Added for debugging

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
      
      // DEBUG: Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching appointments with token:', token.substring(0, 10) + '...');
      
      // Make API request
      const response = await axios.get('http://localhost:5999/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // DEBUG: Log full response
      console.log('API Response data:', response.data);
      
      // Filters for appointments on the selected date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      console.log('Filtering appointments between:', startOfDay, 'and', endOfDay);
      
      const filteredAppointments = response.data.filter(appointment => {
        // Debug each appointment's date check
        const appointmentDate = new Date(appointment.start_time);
        const isInRange = appointmentDate >= startOfDay && appointmentDate < endOfDay;
        console.log(
          'Appointment:', 
          appointment._id,
          'Date:', 
          appointmentDate,
          'In range?', 
          isInRange
        );
        return isInRange;
      });
      
      console.log('Filtered appointments:', filteredAppointments.length);
      
      // Sort by start time
      filteredAppointments.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      
      // Store debug info
      setDebug({
        totalAppointments: response.data.length,
        filteredAppointments: filteredAppointments.length,
        date: date.toISOString()
      });
      
      setScheduleTasks(filteredAppointments);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError(`Failed to load appointments: ${err.message}`);
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
    
    // Show debug info in development
    if (debug && scheduleTasks.length === 0) {
      return (
        <>
          <div className="no-tasks-message">No appointments scheduled for this day.</div>
          <div className="debug-info">
            <p>Debug: Total appointments from API: {debug.totalAppointments}</p>
            <p>Debug: Filtered appointments: {debug.filteredAppointments}</p>
            <p>Debug: Selected date: {debug.date}</p>
          </div>
        </>
      );
    }
    
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
/*


/*
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
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5999/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`

        }
      });
      
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

*/