// src/components/StarRating.jsx
// StarRating component that displays 5 stars with a default rating of 5
import React from 'react';

const StarRating = ({rating = 5, setRating}) => {
    rating = rating || 5;
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
                            color: starValue <= (rating || 5) ? '#F6DF21' : '#555'
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