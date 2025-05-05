// src/components/ServiceDropdown.jsx
import React from 'react';

const ServiceDropdown = ({ services, selectedService, setSelectedService }) => {
    return (
        <div style={{ margin: '10px 0' }}>
            <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{
                    font: 'inherit',
                    fontSize: '24px',
                    padding: '8px 12px',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #555'
                }}
            >
                <option value="">Services</option>
                {services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                ))}
            </select>
        </div>
    );
};

export default ServiceDropdown;