// src/components/StarRating.jsx
import React from 'react';

const StarRating = ({ rating, setRating }) => {
    const maxStars = 5;

    const handleClick = (starValue) => {
        setRating(starValue);
    };

    return (
        <div style={{ fontSize: '48px', color: '#F6DF21' }}>
            {[...Array(maxStars)].map((_, i) => {
                const starValue = i + 1;
                return (
                    <span
                        key={i}
                        onClick={() => handleClick(starValue)}
                        style={{
                            cursor: 'pointer',
                            marginRight: '8px',
                            color: starValue <= rating ? '#F6DF21' : '#555'
                        }}
                    >
            ★
          </span>
                );
            })}
        </div>
    );
};

export default StarRating;