// src/components/RatingDistribution.jsx
import React from 'react';

const RatingDistribution = ({ distribution }) => {
    const formatPercentage = (value) => {
        return Number(value.toFixed(1));
    };

    return (
        <div style={{ color: '#fff', fontSize: '24px', lineHeight: 1.4 }}>
            {distribution.map((item) => {
                const formattedPercentage = formatPercentage(item.percentage);

                return (
                    <div
                        key={item.stars}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px'
                        }}
                    >
                        <span style={{ width: '30px', color: '#F6DF21', fontWeight: 'bold' }}>
                            {item.stars}
                        </span>
                        <div style={{
                            height: '16px',
                            width: '600px',
                            backgroundColor: '#555',
                            margin: '0 10px',
                            position: 'relative',
                            borderRadius: '8px'
                        }}>
                            <div
                                style={{
                                    height: '100%',
                                    width: `${formattedPercentage}%`,
                                    backgroundColor: '#F6DF21',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                        <span style={{ width: '60px', textAlign: 'right' }}>
                            {formattedPercentage}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default RatingDistribution;