// src/components/ReviewRing.jsx
import React from 'react';

const ReviewRing = ({ rating, maxRating }) => {
    const size = 200;
    const radius = 80;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const ratingRatio = rating / maxRating;
    const offset = circumference - ratingRatio * circumference;

    return (
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
            <svg
                width={size}
                height={size}
                style={{ transform: 'rotate(-90deg)' }}
            >
                <circle
                    stroke="#555"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                />
                <circle
                    stroke="#F6DF21"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    strokeLinecap="round"
                />
            </svg>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${size}px`,
                    height: `${size}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
        <span style={{ fontSize: '48px', color: '#F6DF21', fontWeight: 'bold' }}>
          {rating.toFixed(1)}
        </span>
            </div>
        </div>
    );
};

export default ReviewRing;