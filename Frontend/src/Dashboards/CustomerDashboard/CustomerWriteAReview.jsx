// src/Dashboards/CustomerDashboard/CustomerWriteAReview.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../../components/StarRating';
import ServiceDropdown from '../../components/ServiceDropdown';
import { useAuth } from '../../context/AuthContext';


const CustomerWriteAReview = () => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [selectedService, setSelectedService] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('Please log in to submit a review.');
      return;
    }
    if (!selectedService) {
      setError('Please pick a service to review.');
      return;
    }
    if (rating < 1) {
      setError('Please select a rating (1-5 stars).');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const reviewData = {
      userFullName: `${currentUser.firstName} ${currentUser.lastName}`,
      stars: rating,
      service: selectedService,
      comment: comment.trim(),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5999/reviews',
        reviewData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess('Thank you for your review!');
        setRating(5);
        setSelectedService('');
        setComment('');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    return (
        <div style={{ color: '#fff', maxWidth: '600px', padding: '20px' }}>
            <h1 style={{ fontSize: '64px', marginBottom: '20px' }}>Write a Review</h1>

            {error && <div style={{ color: 'salmon' }}>{error}</div>}
            {success && <div style={{ color: 'lightgreen' }}>{success}</div>}

            <div style={{ fontSize: '48px', marginBottom: '10px' }}>Give a Rating</div>
            <StarRating rating={rating} setRating={setRating} />

            <div style={{ fontSize: '48px', margin: '20px 0 10px' }}>
                Select Service to Rate
            </div>
            <ServiceDropdown
                services={[
                    'Oil Change',
                    'Tire Rotation',
                    'Brake Service',
                    'Engine Repair',
                    'General Maintenance',
                    'Other'
                ]}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
            />

            <div style={{ fontSize: '48px', margin: '20px 0 10px' }}>
                Additional Comments (Optional)
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                style={{
                    font: 'inherit',
                    width: '100%',
                    height: '150px',
                    fontSize: '24px',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #555',
                    padding: '10px',
                }}
                placeholder="Type here..."
            />

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        font: 'inherit',
                        fontSize: '24px',
                        backgroundColor: '#DE1E29',
                        color: '#F6DF21',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    {loading ? 'Submitting…' : 'Submit Review'}
                </button>
            </div>
        </div>
    );
};

export default CustomerWriteAReview;