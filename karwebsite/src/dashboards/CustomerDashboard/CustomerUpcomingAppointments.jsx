//This should allow the customer when logged in to be able to see their previous appointments.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CustomerScheduleAnAppointment from './CustomerScheduleAnAppointment';




const CustomerAppointmentHistory = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    // Fetch appointment history when component mounts
    if (currentUser && currentUser.email) {
      fetchAppointmentHistory(currentUser.email);
    } else {
      setLoading(false);
      setError('You need to be logged in to view appointment history.');
    }
  }, [currentUser]);


  const fetchAppointmentHistory = async (email) => {
    try {
      setLoading(true);
      console.log(`Fetching appointments for: ${email}`);
      const response = await axios.get(`http://localhost:5999/api/appointments/history?email=${encodeURIComponent(email)}`);
      ////////////changed filter to get completed appointments only
      const completedAppointments = response.data.filter(appointment => 
        appointment.status !== 'completed' && appointment.status !== 'in_progress' && appointment.status !== 'canceled');
      //setAppointments to completed appointments instead of response.data
      setAppointments(completedAppointments);
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


  const handleCancel = async (appointment, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        
        const response = await axios.delete(`http://localhost:5999/api/appointments/${appointment._id}`);
        
        if (response.status === 200){
          alert('Appointment Cancelled Successfully');
        }
          
        
        // need an API endpoint to handle cancellation
        // await axios.delete(`/api/appointments/${id}`);
        //setScheduleTasks(scheduleTasks.filter(task => task._id !== id));
        setAppointments(appointments.filter(apt => apt._id !== appointment._id));

      } catch (err) {
        console.error('Failed to cancel appointment:', err);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  /************************ *
  const HandleUpdateAppointment = () => {
    const [activeSection, setActiveSection] = useState('CustomerScheduleAnAppointment');
    //const [firstName, setFirstName] = useState('CustomerName'); // dynamic in the future

/*
    const setSection = () => {
      activeSection=<CustomerScheduleAnAppointment />;
    };
*
};
*/
    
  
  
  

  if (loading) return <div className="loading">Loading your upcoming appointments...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (appointments.length === 0) return <div className="no-appointments">You don't have any upcoming appointments.</div>;

  return (
    <div className="customer-history-container">
      <h2>Your Appointment History</h2>
      <div className="appointment-list">
        {appointments.map(appointment => (
            
          <div key={appointment._id} className={`customer-schedule-item ${getStatusClass(appointment.status)}`}>
            <div className="appointment-header">
              <span className="appointment-date">{formatDate(appointment.start_time)}</span>
              <span className={`appointment-status ${getStatusClass(appointment.status)}`}>
                {appointment.status === 'completed' ? 'Completed' : 
                 appointment.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
              </span>
            
            </div>
            {/*<div className="appointment-details">*/}
            <div className="appointment-content">
              <div className="service-column">
              <h3 className="schedule-service">{appointment.event_type}</h3>
              <div className="time-container">
              <span className="appt-sched-time">
            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
            </span>
            </div>
            </div>
            

              <button className="update-button"
              /*onClick={() => HandleUpdateAppointment(appointment)}*/> Update Appointment </button>
              <button className="cancel-appt-button"
              onClick={(e) => handleCancel(appointment, e)}>Cancel</button>
              </div>
             
            


              <div className="appt-info">
                <span className="appt-vehicle">{appointment.vehicle_year} {appointment.vehicle_make} {appointment.vehicle_model}</span>
                
              </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerAppointmentHistory;

