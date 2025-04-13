// src/pages/CustomerWriteAReview.jsx
import React, { useState } from 'react';
import StarRating from '../../components/StarRating';
import ServiceDropdown from '../../components/ServiceDropdown';

const CustomerWriteAReview = () => {
    const [rating, setRating] = useState(0);
    const [selectedService, setSelectedService] = useState('');
    const [comments, setComments] = useState('');

    // example array of past services; fetch this from backend later
    const pastServices = [
        'Brake Repair',
        'Engine Diagnostics',
        'Transmission Service',
        'Air Conditioning Service',
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const reviewData = {
            rating,
            service: selectedService,
            comments
        };

        // later, make an API call here, e.g.:
        // axios.post('/api/reviews', reviewData)
        //  .then(...)
        //  .catch(...);

        console.log('Submitting review:', reviewData);

        // Reset form
        setRating(0);
        setSelectedService('');
        setComments('');
    };

    return (
        <div style={{ color: '#fff', maxWidth: '600px', padding: '20px' }}>
            <h1 style={{ fontSize: '64px', marginBottom: '20px' }}>Write a Review</h1>

            <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                Give a Rating
            </div>
            <StarRating rating={rating} setRating={setRating} />

            <div style={{ fontSize: '48px', margin: '20px 0 10px' }}>
                Select Past Service to Rate
            </div>
            <ServiceDropdown
                services={pastServices}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
            />

            <div style={{ fontSize: '48px', margin: '20px 0 10px' }}>
                Additional Comments (Optional)
            </div>
            <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{
                    font: 'inherit',
                    width: '100%',
                    height: '150px',
                    fontSize: '24px',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #555',
                    padding: '10px'
                }}
                placeholder="Type here..."
            />

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleSubmit}
                    style={{
                        font: 'inherit',
                        fontSize: '24px',
                        backgroundColor: '#DE1E29',
                        color: '#F6DF21',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default CustomerWriteAReview;