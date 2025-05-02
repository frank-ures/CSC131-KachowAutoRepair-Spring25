
const CustomerScheduleAnAppointment = () => {
    return (
        <div className="content-section">
            <h1 className="page-title">Schedule An Appointment</h1>
            <p>Merge with Schedule Appointment Scrum Task Later</p>
        </div>
    );
};

export default CustomerScheduleAnAppointment;


/*
import React, { useEffect, useState, useRef } from 'react';
import '../../App.css'; // We'll move styles to a separate CSS file

const AppointmentScheduler = () => {
  const [activeService, setActiveService] = useState(null);
  const calendlyContainerRef = useRef(null);
  
  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Wait for script to load before initializing
    script.onload = () => {
      // This ensures Calendly's script has loaded before we try to use it
      if (services.length > 0) {
        handleServiceClick(services[0], 0);
      }
    };
    
    return () => {
      // Clean up the script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  // Function to load Calendly widget with specific URL
  const loadCalendly = (url) => {
    if (calendlyContainerRef.current) {
      // Use the Calendly API properly
      // First clear any existing content
      calendlyContainerRef.current.innerHTML = '';
      
      // Initialize with proper data attributes instead of creating iframe directly
      const div = document.createElement('div');
      div.setAttribute('data-url', url);
      div.style.width = '100%';
      div.style.height = '700px';
      calendlyContainerRef.current.appendChild(div);
      
      // Properly initialize Calendly using their API
      if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
        window.Calendly.initInlineWidget({
          url: url,
          parentElement: div,
          prefill: {},
          utm: {}
        });
      }
    }
  };
  
  // Services data
  const services = [
    { name: "Air Conditioning Service", url: "https://calendly.com/kachowautorepair/air-conditioning-service?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Battery Replacement", url: "https://calendly.com/kachowautorepair/battery-replacement?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Brake Repair & Replacement", url: "https://calendly.com/kachowautorepair/brake-repair-and-replacement?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Cabin and Engine Air Filter Replacement", url: "https://calendly.com/kachowautorepair/cabin-and-engine-air-filter-replacement?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Coolant System Flush", url: "https://calendly.com/kachowautorepair/coolant-system-flush?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Engine Diagnostic", url: "https://calendly.com/kachowautorepair/engine-diagnostic?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Headlight Restoration", url: "https://calendly.com/kachowautorepair/headlight-restoration?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Oil Change", url: "https://calendly.com/kachowautorepair/tire-rotation-and-balance?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Spark Plug Replacement", url: "https://calendly.com/kachowautorepair/spark-plug-replacement?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Suspension and Steering Repair", url: "https://calendly.com/kachowautorepair/suspension-and-steering-repair?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Tire Rotation And Balance", url: "https://calendly.com/kachowautorepair/tire-rotation-and-balance-clone?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Transmission Service", url: "https://calendly.com/kachowautorepair/transmission-service?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Wheel Alignment", url: "https://calendly.com/kachowautorepair/wheel-alignment?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" }
  ];

  // Handle service selection
  const handleServiceClick = (service, index) => {
    setActiveService(index);
    loadCalendly(service.url);
  };

  return (
    <div className="appointment-scheduler">
      {/* Header *
      <header className="logo header">
        <div>
          <button className="back-button">Back</button>
          <img src="/images/logo.png" alt="Kachow Auto Repair" />
          <p>Kachow Auto Repair</p>
        </div>
        <nav id="navigation-bar">
          <ul className="nav-links">
            <li><a href="#">HOME</a></li>
            <li><a href="#">SERVICES</a></li>
            <li><a href="#">ABOUT US</a></li>
            <li><a href="#">REVIEWS</a></li>
            <li><a href="#">ACCOUNT</a></li>
          </ul>
        </nav>
      </header>

      {/* Service Buttons *
      <div className="events-container">
        {services.map((service, index) => (
          <button
            key={index}
            className={`event-button ${activeService === index ? 'active' : ''}`}
            onClick={() => handleServiceClick(service, index)}
          >
            {service.name}
          </button>
        ))}
      </div>

      {/* Calendly Widget Container *
      <div className="calendly-inline-widget" ref={calendlyContainerRef} />
    </div>
  );
};

export default AppointmentScheduler;




/*
// src/components/CustomerScheduleAnAppointment.jsx
//import React from 'react';

import React, { useEffect, useState, useRef } from 'react';

const AppointmentScheduler = () => {
  const [activeService, setActiveService] = useState(null);
  const calendlyContainerRef = useRef(null);
  
  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);
  
  // Function to load Calendly widget with specific URL
  const loadCalendly = (url) => {
    if (calendlyContainerRef.current) {
      calendlyContainerRef.current.innerHTML = '';
      
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.width = '100%';
      iframe.style.height = '700px';
      iframe.style.border = 'none';
      calendlyContainerRef.current.appendChild(iframe);
    }
  };
  
  // Services data
  const services = [
    { name: "Air Conditioning Service", url: "https://calendly.com/kachowautorepair/air-conditioning-service?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Battery Replacement", url: "https://calendly.com/kachowautorepair/battery-replacement?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Brake Repair & Replacement", url: "https://calendly.com/kachowautorepair/brake-repair-and-replacement?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Cabin and Engine Air Filter Replacement", url: "https://calendly.com/kachowautorepair/cabin-and-engine-air-filter-replacement?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Coolant System Flush", url: "https://calendly.com/kachowautorepair/coolant-system-flush?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Engine Diagnostic", url: "https://calendly.com/kachowautorepair/engine-diagnostic?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Headlight Restoration", url: "https://calendly.com/kachowautorepair/headlight-restoration?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Oil Change", url: "https://calendly.com/kachowautorepair/tire-rotation-and-balance?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Spark Plug Replacement", url: "https://calendly.com/kachowautorepair/spark-plug-replacement?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Suspension and Steering Repair", url: "https://calendly.com/kachowautorepair/suspension-and-steering-repair?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Tire Rotation And Balance", url: "https://calendly.com/kachowautorepair/tire-rotation-and-balance-clone?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Transmission Service", url: "https://calendly.com/kachowautorepair/transmission-service?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" },
    { name: "Wheel Alignment", url: "https://calendly.com/kachowautorepair/wheel-alignment?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&primary_color=de1e29" }
  ];

  // Handle service selection
  const handleServiceClick = (service, index) => {
    setActiveService(index);
    loadCalendly(service.url);
  };

  // Default to first service on initial load
  useEffect(() => {
    if (services.length > 0) {
      handleServiceClick(services[0], 0);
    }
  }, []);

  return (
    <div className="appointment-scheduler">
      {/* CSS Styles *
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Courier New', Courier, monospace;
        }
        
        body {
          background-color: black;
        }
        
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
          padding-left: 10px;
        }
        
        .header div {
          height: auto;
          color: yellow;
          font-weight: bold;
          width: 375px;
          background-color: gray;
          border-color: white;
          border-width: 1px;
          border-style: solid;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .logo.header {
          display: flex;
          border-style: solid;
          align-items: center;
          justify-content: flex-start;
          padding: 15px 50px;
          list-style: none;
        }
        
        .logo img {
          height: auto;
          width: 50px;
          margin-right: 10px;
        }
        
        .back-button {
          height: auto;
          padding: 5px 10px;
          color: #DE1E29;
          border: none;
          cursor: pointer;
        }
        
        header nav {
          display: flex;
          border-color: white;
          border-radius: 10px;
          border-width: 1px;
          border-style: solid;
          background-color: #DE1E29;
          padding: 15px 20px;
        }
        
        .nav-links {
          list-style: none;
          display: flex;
        }
        
        .nav-links li {
          margin: 0 15px;
        }
        
        .nav-links a {
          text-decoration: none;
          color: white;
          font-size: 18px;
          font-weight: bold;
          transition: color 0.3s;
        }
        
        .nav-links a:hover {
          color: black;
        }
        
        .events-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px;
          justify-content: center;
        }
        
        .event-button {
          background-color: gray;
          color: white;
          font-size: 20px;
          padding: 15px 25px;
          border: 2px solid white;
          border-radius: 10px;
          font-weight: bold;
          text-align: center;
          cursor: pointer;
          width: 250px;
          margin: 10px;
          transition: all 0.3s ease-in-out;
        }
        
        .event-button:hover {
          background-color: #DE1E29;
          color: white;
          transform: scale(1.05);
        }
        
        .event-button.active {
          background-color: #DE1E29;
          color: white;
        }
        
        .calendly-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        
        .calendly-inline-widget {
          display: block;
          margin: auto;
          width: 90%;
          max-width: 900px;
          height: 800px;
        }
        
        .calendly-inline-widget iframe {
          width: 100%;
          padding: 0 15%;
        }
        
        @media (max-width: 768px) {
          header {
            flex-direction: column;
            align-items: center;
          }
          
          .nav-links {
            flex-direction: column;
            text-align: center;
          }
          
          .nav-links li {
            margin: 10px 0;
          }
          
          .events-container {
            flex-direction: column;
            gap: 15px;
          }
          
          .event-button {
            width: 100%;
            font-size: 14px;
          }
        }
      `}</style>

      {/* Header *
      <header className="logo header">
        <div>
          <button className="back-button">Back</button>
          <img src="/images/logo.png" alt="Kachow Auto Repair" />
          <p>Kachow Auto Repair</p>
        </div>
        <nav id="navigation-bar">
          <ul className="nav-links">
            <li><a href="#">HOME</a></li>
            <li><a href="#">SERVICES</a></li>
            <li><a href="#">ABOUT US</a></li>
            <li><a href="#">REVIEWS</a></li>
            <li><a href="#">ACCOUNT</a></li>
          </ul>
        </nav>
      </header>

      {/* Service Buttons *
      <div className="events-container">
        {services.map((service, index) => (
          <button
            key={index}
            className={`event-button ${activeService === index ? 'active' : ''}`}
            onClick={() => handleServiceClick(service, index)}
          >
            {service.name}
          </button>
        ))}
      </div>

      {/* Calendly Widget Container *
      <div className="calendly-inline-widget" ref={calendlyContainerRef} />
    </div>
  );
};

export default AppointmentScheduler;
*/



/*
const CustomerScheduleAnAppointment = () => {
    return (
        <div className="content-section">
            <h1 className="page-title">Schedule An Appointment</h1>
            <p>Merge with Schedule Appointment Scrum Task Later</p>
        </div>
    );
};

export default CustomerScheduleAnAppointment;
*/