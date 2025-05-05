// src/components/BlackBox.jsx
import React from 'react';
import '../components_CSS/BlackBox.css';

const BlackBox = ({ children }) => {
    return (
        <div className="black-box">
            {children}
        </div>
    );
};

export default BlackBox;