import React, { useState, useEffect, useRef } from 'react';
import './ContactUsBox.css';

const ContactUsBox = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Load Leaflet only if not already loaded
    if (window.L) {
      initializeMap();
      return;
    }

    // Load CSS if not already loaded
    if (!document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }

    // Load script if not already loaded
    if (!document.querySelector('script[src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"]')) {
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.body.appendChild(leafletScript);

      leafletScript.onload = () => {
        initializeMap();
      };
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current || !window.L) return;
    
    // Cleanup previous map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    
    try {
      // Create map with Sacramento coordinates
      mapRef.current = window.L.map(mapContainer.current).setView([38.581, -121.4944], 15);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapRef.current);
      
      // Create a custom icon for KAR Service Center
      const customIcon = window.L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="marker-container">
            <div class="marker-title">KAR</div>
            <div class="marker-subtitle">SERVICE CENTER</div>
            <div class="marker-icon">⚡</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
      
      // Add the marker
      window.L.marker([38.581, -121.4944], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup('KAR Service Center<br>6000 J Street, Sacramento, CA, 95819')
        .openPopup();
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create form data object
      const formDataToSend = new FormData();
      
      // Add your Web3Forms access key - REPLACE THIS WITH YOUR ACTUAL KEY
      formDataToSend.append("access_key", "9f5767a4-eb34-413f-a77d-a0b677ce583d");
      
      // Add form fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("message", formData.comments);
      
      // Add subject
      formDataToSend.append("subject", "New Contact Form Submission from KAR Auto Repair");
      
      // Convert to JSON for fetch API
      const jsonData = JSON.stringify(Object.fromEntries(formDataToSend));
      
      // Submit the form
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: jsonData
      }).then(res => res.json());

      // Handle the response
      if (response.success) {
        console.log("Success", response);
        setIsSubmitting(false);
        setIsSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          comments: ''
        });
      } else {
        throw new Error(response.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
      setError("Failed to send message. Please try again later.");
    }
  };
  
  const scheduleAppointment = () => {
    alert('Redirecting to appointment scheduling page...');
    // You can replace this with actual navigation logic
    // window.location.href = '/schedule';
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us-wrapper">
        {/* Map Section */}
        <div ref={mapContainer} className="map-section"></div>
        
        {/* Form Section */}
        <div className="form-section">
          <h2 className="form-title">CONTACT US</h2>
          
          {isSubmitted ? (
            <div className="success-message">
              <h3>Thank you for your message!</h3>
              <p>We'll get back to you as soon as possible.</p>
              <button 
                onClick={handleSendAnother}
                className="submit-button"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">NAME</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Type here..."
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Type here..."
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">PHONE NUMBER</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Type here..."
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">COMMENTS</label>
                <textarea
                  name="comments"
                  placeholder="Type here..."
                  value={formData.comments}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-submit">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'SENDING...' : 'SUBMIT'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <div className="appointment-section">
        <h3 className="appointment-text">WHAT ARE YOU WAITING FOR? SCHEDULE YOUR APPOINTMENT TODAY!</h3>
        <button onClick={scheduleAppointment} className="appointment-button">
          SCHEDULE APPOINTMENT
        </button>
      </div>
    </div>
  );
};

export default ContactUsBox;