// src/components/LoginToMakeReviewButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LoginToMakeReviewButton.css';

const LoginToMakeReviewButton = () => {
    return (
        <Link to="/customer" className="log-in-to-make-review-btn">
            LOGIN TO MAKE A REVIEW
        </Link>
    );
};

export default LoginToMakeReviewButton;