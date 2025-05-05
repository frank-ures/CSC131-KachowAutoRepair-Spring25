// src/components/AboutUsBox.jsx
import React from 'react';
import '../components_CSS/AboutUsBox.css';

const AboutUsBox = ({ imgSrc, name}) => {
    return (
        <div className="employee-box">
            <img src={imgSrc} alt="Employee" className="employee-img" />
            <p className="employee-name"> {name} </p>
        </div>
    );
};

export default AboutUsBox;