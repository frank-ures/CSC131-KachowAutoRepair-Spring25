import React, { useEffect, useState, useRef } from 'react';
import "../../components_CSS/appointsched.css";

const AppointmentScheduler = () => {
  const [activeService, setActiveService] = useState(null);
  const calendlyContainerRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  
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
  
  useEffect(() => {
    // This is a cleaner approach to load the Calendly script only once
    if (!window.Calendly && !scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      
      // Add the Calendly embed code to the head
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      
      // Handle script loading errors gracefully
      script.onerror = () => {
        console.error('Failed to load Calendly widget script');
        scriptLoadedRef.current = false;
      };
      
      // Only initialize Calendly after the script has fully loaded
      script.onload = () => {
        console.log('Calendly script loaded successfully');
        if (services.length > 0) {
          setTimeout(() => {
            handleServiceClick(services[0], 0);
          }, 100); // Give a slight delay to ensure DOM is ready
        }
      };
      
      document.head.appendChild(script);
    } else if (window.Calendly && activeService === null && services.length > 0) {
      // If Calendly is already loaded but no service is selected yet
      handleServiceClick(services[0], 0);
    }
    
    // Clean up function
    return () => {
      if (calendlyContainerRef.current) {
        calendlyContainerRef.current.innerHTML = '';
      }
    };
  }, []);
  
  // Function to load Calendly widget with specific URL
  const loadCalendly = (url) => {
    if (!calendlyContainerRef.current) {
      console.error('Calendar container reference is null');
      return;
    }
    
    if (!window.Calendly) {
      console.error('Calendly not loaded yet');
      return;
    }
    
    try {
      // Clear existing content first
      calendlyContainerRef.current.innerHTML = '';
      
      // Add embed_domain parameter to the URL if not already present
      const urlObj = new URL(url);
      if (!urlObj.searchParams.has('embed_domain')) {
        urlObj.searchParams.set('embed_domain', window.location.host);
      }
      
      // Initialize Calendly widget with the updated URL
      window.Calendly.initInlineWidget({
        url: urlObj.toString(),
        parentElement: calendlyContainerRef.current,
        prefill: {},
        utm: {}
      });
      
      console.log('Calendly widget initialized successfully');
    } catch (error) {
      console.error('Error initializing Calendly widget:', error);
    }
  };

  // Handle service selection
  const handleServiceClick = (service, index) => {
    setActiveService(index);
    
    // Use a timeout to ensure React has updated the state before we try to load Calendly
    setTimeout(() => {
      if (window.Calendly) {
        loadCalendly(service.url);
      } else {
        console.warn('Calendly not loaded yet, skipping widget initialization');
      }
    }, 50);
  };

  return (
    <div className="appointment-scheduler">
      <h1 className="page-title"> Schedule An Appointment</h1>

      {/* Service Buttons */}
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

      {/* Calendly Widget Container */}
      <div 
        className="calendly-inline-widget" 
        ref={calendlyContainerRef}
        style={{ minWidth: '320px', height: '700px' }}
        data-auto-load="false"
      />
    </div>
  );
};

export default AppointmentScheduler;