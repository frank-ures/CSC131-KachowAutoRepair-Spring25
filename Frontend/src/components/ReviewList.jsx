// src/components/ReviewList.jsx
import React from 'react';
import leftArrowIcon from '../images/left-arrow-icon.png';
import rightArrowIcon from '../images/right-arrow-icon.png';

const ReviewList = ({ reviews, page, setPage, reviewsPerPage }) => {
    const startIndex = (page - 1) * reviewsPerPage;
    const displayedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const renderStars = (rating) => {
        const filledStars = Math.min(Math.floor(rating), 5);
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        color: i <= filledStars ? '#F6DF21' : '#555',
                        fontSize: '32px',
                        marginRight: '4px'
                    }}
                >
          ★
        </span>
            );
        }
        return <>{stars}</>;
    };

    return (
        <div style={{color: '#fff', fontSize: '32px', lineHeight: 1.5, padding: '20px 0'}}>
        {displayedReviews.map((review, index) => (
            <div key={index} style={{marginBottom: '60px'}}>
            <div>
                        {renderStars(review.rating)}
                    </div>
                    <p style={{ margin: '8px 0', fontSize: '32px' }}>
                        {review.text}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '24px', color: '#F6DF21', fontWeight: 'bold' }}>
                        {review.name}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '24px', color: '#9C9C9C' }}>
                        {review.service}
                    </p>
                    <hr style={{ borderColor: '#555' }} />
                </div>
            ))}

            <div style={{textAlign: 'center', margin: '32px 0', fontSize: '24px', padding: '20px'}}>
            <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: page <= 1 ? 'default' : 'pointer',
                        marginRight: '16px'
                    }}
                >
                    <img
                        src={leftArrowIcon}
                        alt="Previous"
                        style={{ width: '24px', opacity: page <= 1 ? 0.3 : 1, filter: 'invert(1)'}}
                    />
                </button>

                <span> Page {page} of {totalPages} </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: page >= totalPages ? 'default' : 'pointer',
                        marginLeft: '16px'
                    }}
                >
                    <img
                        src={rightArrowIcon}
                        alt="Next"
                        style={{ width: '24px', opacity: page === totalPages ? 0.3 : 1, filter: 'invert(1)'}}
                    />
                </button>
            </div>
            
        </div>
    );
};

export default ReviewList;