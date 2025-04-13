// src/components/homeCustomerReview.jsx
import React from 'react';
import './homeCustomerReview.css';

const HomeCustomerReview = ({ imgSrc, reviewText, reviewerName}) => {
    return (
        <div className="review-container">
            <div className="review-img-wrapper">
                <img src={imgSrc} alt="Owner" className="review-img" />
            </div>
            <div className="review-box">
                <p className="review-text">“{reviewText}”</p>
                <p className="review-name">- {reviewerName}</p>
                <p className="review-stars"> ⭐️⭐️⭐️⭐️⭐️</p>
            </div>
        </div>
    );
};

export default HomeCustomerReview;