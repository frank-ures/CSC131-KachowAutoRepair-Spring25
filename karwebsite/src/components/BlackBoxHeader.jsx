// src/components/BlackBox.jsx
import React from 'react';
import './BlackBoxHeader.css';

const BlackBoxHeader = ({ children }) => {
    return (
        <div className="black-box-header">
            {children}
        </div>
    );
};

export default BlackBoxHeader;