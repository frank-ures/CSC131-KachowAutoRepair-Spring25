// src/components/BlackBox.jsx
import React from 'react';
import '../components_CSS/BlackBoxHeader.css';

const BlackBoxHeader = ({ children }) => {
    return (
        <div className="black-box-header">
            {children}
        </div>
    );
};

export default BlackBoxHeader;