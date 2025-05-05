import React, { useState, useEffect } from 'react';
import axios from 'axios';



const CustomerOverview = () => {


  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the current appointment on component mount
    fetchCurrentAppointment();
    
    // Set up an interval to refresh the current appointment every 30 seconds
    const intervalId = setInterval(fetchCurrentAppointment, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchCurrentAppointment = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5999/api/appointments/current');
      
      if (response.data && response.data._id) {
        setCurrentAppointment(response.data);
      } else {
        setCurrentAppointment(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch current appointment:', err);
      setError('Failed to load current appointment. Please try again later.');
      setLoading(false);
    }
  };
  
  // Format time for display
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render the current appointment progress section
  const renderCurrentAppointment = () => {
    if (loading) return <div className="loading">Loading current appointment...</div>;
    if (error) return <div className="error">{error}</div>;
    
    if (!currentAppointment) {
      return (
        <div className="no-appointment">
          <p>No appointment currently in progress.</p>
        </div>
      );
    }


    let progressPercent = 0;
let statusDisplay = "Waiting";

if (currentAppointment.status === 'in_progress') {
  statusDisplay = "In Progress";
  
  // Only proceed with calculation if started_at has a value
  if (currentAppointment.started_at) {
    // Parse the start time
    const startTime = new Date(currentAppointment.started_at);
    
    // Calculate end time by adding the estimated duration
    // Assuming currentAppointment.estimated_duration is in minutes
    const estimatedDurationMs = (currentAppointment.estimated_duration || 30) * 60 * 1000;
    const projectedEndTime = new Date(startTime.getTime() + estimatedDurationMs);
    
    const now = new Date();
    
    console.log("Time values:", {
      startTime: startTime.toISOString(),
      projectedEndTime: projectedEndTime.toISOString(),
      now: now.toISOString(),
      estimatedDuration: (estimatedDurationMs / (60 * 1000)) + " minutes"
    });
    
    // Makes sure dates are valid before calculation
    if (!isNaN(startTime.getTime()) && !isNaN(projectedEndTime.getTime())) {
      const totalDuration = projectedEndTime.getTime() - startTime.getTime();
      const elapsed = now.getTime() - startTime.getTime();
      
      // Ensures we have positive values
      if (totalDuration > 0 && elapsed >= 0) {
        progressPercent = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
      } else {
        console.log("Invalid duration values, defaulting to 0%");
      }
    } else {
      console.log("Invalid date values, defaulting to 0%");
    }
  } else {
    console.log("No started_at time available for in-progress appointment");
  }
} else if (currentAppointment.status === 'completed') {
  statusDisplay = "Done";
  progressPercent = 100;
}

// Safety check
progressPercent = Math.max(0, Math.min(100, progressPercent));
console.log("Final progress percentage:", progressPercent);
    
    return (
      <div className="current-appointment-container">
        <h2>Current Appointment</h2>
        
        <div className="appointment-details">
          <div className="customer-info">
            <h3>{currentAppointment.invitee_name}</h3>
            <p className="service-type">{currentAppointment.event_type}</p>
            <p className="vehicle-info">
              {currentAppointment.vehicle_year} {currentAppointment.vehicle_make} {currentAppointment.vehicle_model}
            </p>
            <p className="appointment-time">
              {formatTime(currentAppointment.start_time)} - {formatTime(currentAppointment.end_time)}
            </p>
          </div>
          
          <div className="appointment-status">
          <div className={`status-badge status-${currentAppointment.status}`}>
              {statusDisplay}
          </div>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-label">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="progress-bar">
          <div 
  className="progress-fill" 
  style={{ width: `${progressPercent}%` }}
  data-progress={progressPercent} // For debugging
></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="content-section">
      <h1 className="page-title">Overview</h1>
      
      <div className="dashboard-section">
        <h2>Today's Summary</h2>
        <p>Add overview content later</p>
      </div>
      
      <div className="dashboard-section">
        <h2>Current Appointment Progress</h2>
        {renderCurrentAppointment()}
      </div>
    </div>
  );
};

export default CustomerOverview;

/****TRY IF USER IS LOGGED IN. MAY WORK TO SHOW ONLY THE LOGGED IN CUSTOMERS APPT 
 * It will display the appointment that is currently in progress 
 * on the customer overview page
 * 
 * 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerOverview = () => {
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the customer ID from wherever you store it (localStorage, context, etc.)
  // This is an example - replace with your actual method of getting the customer ID
  const getCustomerId = () => {
    // Example: Get from localStorage
    return localStorage.getItem('customerId');
    // Or from auth context if you're using React context for authentication
    // return useAuth().user.id;
  };

  useEffect(() => {
    // Fetch the current appointment on component mount
    fetchCurrentAppointment();
    
    // Set up an interval to refresh the current appointment every 30 seconds
    const intervalId = setInterval(fetchCurrentAppointment, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchCurrentAppointment = async () => {
    try {
      setLoading(true);
      const customerId = getCustomerId();
      
      if (!customerId) {
        console.error('No customer ID found');
        setError('Authentication issue. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Include the customer ID in the API call
      const response = await axios.get(`http://localhost:5999/api/appointments/current?customerId=${customerId}`);
      
      if (response.data && response.data._id) {
        setCurrentAppointment(response.data);
      } else {
        setCurrentAppointment(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch current appointment:', err);
      setError('Failed to load current appointment. Please try again later.');
      setLoading(false);
    }
  };
  
  // Format time for display
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render the current appointment progress section
  const renderCurrentAppointment = () => {
    if (loading) return <div className="loading">Loading current appointment...</div>;
    if (error) return <div className="error">{error}</div>;
    
    if (!currentAppointment) {
      return (
        <div className="no-appointment">
          <p>No appointment currently in progress.</p>
        </div>
      );
    }

    let progressPercent = 0;
    let statusDisplay = "Waiting";

    if (currentAppointment.status === 'in_progress') {
      statusDisplay = "In Progress";
      
      // Only proceed with calculation if started_at has a value
      if (currentAppointment.started_at) {
        // Parse the start time
        const startTime = new Date(currentAppointment.started_at);
        
        // Calculate end time by adding the estimated duration
        const estimatedDurationMs = (currentAppointment.estimated_duration || 30) * 60 * 1000;
        const projectedEndTime = new Date(startTime.getTime() + estimatedDurationMs);
        
        const now = new Date();
        
        console.log("Time values:", {
          startTime: startTime.toISOString(),
          projectedEndTime: projectedEndTime.toISOString(),
          now: now.toISOString(),
          estimatedDuration: (estimatedDurationMs / (60 * 1000)) + " minutes"
        });
        
        // Make sure dates are valid before calculation
        if (!isNaN(startTime.getTime()) && !isNaN(projectedEndTime.getTime())) {
          const totalDuration = projectedEndTime.getTime() - startTime.getTime();
          const elapsed = now.getTime() - startTime.getTime();
          
          // Ensure we have positive values
          if (totalDuration > 0 && elapsed >= 0) {
            progressPercent = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
          } else {
            console.log("Invalid duration values, defaulting to 0%");
          }
        } else {
          console.log("Invalid date values, defaulting to 0%");
        }
      } else {
        console.log("No started_at time available for in-progress appointment");
      }
    } else if (currentAppointment.status === 'completed') {
      statusDisplay = "Done";
      progressPercent = 100;
    }

    // Safety check
    progressPercent = Math.max(0, Math.min(100, progressPercent));
    
    return (
      <div className="current-appointment-container">
        <h2>Current Appointment</h2>
        
        <div className="appointment-details">
          <div className="customer-info">
            <h3>{currentAppointment.invitee_name}</h3>
            <p className="service-type">{currentAppointment.event_type}</p>
            <p className="vehicle-info">
              {currentAppointment.vehicle_year} {currentAppointment.vehicle_make} {currentAppointment.vehicle_model}
            </p>
            <p className="appointment-time">
              {formatTime(currentAppointment.start_time)} - {formatTime(currentAppointment.end_time)}
            </p>
          </div>
          
          <div className="appointment-status">
            <div className={`status-badge status-${currentAppointment.status}`}>
              {statusDisplay}
            </div>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-label">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
              data-progress={progressPercent}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="content-section">
      <h1 className="page-title">Overview</h1>
      
      <div className="dashboard-section">
        <h2>Today's Summary</h2>
        <p>Add overview content later</p>
      </div>
      
      <div className="dashboard-section">
        <h2>Current Appointment Progress</h2>
        {renderCurrentAppointment()}
      </div>
    </div>
  );
};

export default CustomerOverview;
***********************************/

 



/***** 
// // src/Dashboards/CustomerDashboard/CustomerOverview.jsx
import React from 'react';

const CustomerOverview = () => {
    return (
        <div className="content-section">
            <h1 className="page-title">Overview</h1>
            <p>Add overview content later</p>
            <p>Current Appointment Progress</p>
        </div>
    );
};

export default CustomerOverview;
*/