import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeLayout from '../../components/HomeLayout';
import ReviewsPageBkgImg from '../../components/reviews-page-bkg-img.png';
import BlackBox from '../../components/BlackBox';
import ScheduleAppointmentButton from '../../components/ScheduleAppointmentButton';
import BlackBoxHeader from '../../components/BlackBoxHeader';
import LoginToMakeReviewButton from '../../components/LoginToMakeReviewButton';
import ReviewRing from '../../components/ReviewRing';
import RatingDistribution from '../../components/RatingDistribution';
import ReviewList from '../../components/ReviewList';
import ContactUsBox from '../../components/ContactUsBox';
import Footer from '../../components/Footer';

const ReviewsPage = () => {
    const [page, setPage] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [distribution, setDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5999/reviews');

                // Transform the reviews data to match your component's expected format
                const transformedReviews = response.data.reviews.map(review => ({
                    rating: review.stars,
                    text: review.comment,
                    name: review.userFullName,
                    service: review.service,
                    date: new Date(review.date)
                }));

                setReviews(transformedReviews);
                setAverageRating(response.data.averageRating);
                setDistribution(response.data.distribution);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
                setError('Failed to load reviews. Please try again later.');
                setReviews([]);
                setAverageRating(0);
                setDistribution([]);
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <HomeLayout bgImage={ReviewsPageBkgImg}>
                <BlackBox>
                    <div style={{ color: '#fff', textAlign: 'center', padding: '20px' }}>
                        Loading reviews...
                    </div>
                </BlackBox>
            </HomeLayout>
        );
    }

    if (error) {
        return (
            <HomeLayout bgImage={ReviewsPageBkgImg}>
                <BlackBoxHeader>Reviews</BlackBoxHeader>
                <BlackBox>
                    <div style={{ color: 'red', textAlign: 'center', padding: '20px', fontSize: '1.5rem', paddingBottom: '60px' }}>
                        {error}
                    </div>
                    <LoginToMakeReviewButton />
                    <p>&emsp;</p>
                    <p>&emsp;</p>
                    <ContactUsBox/>
                    <Footer/>
                </BlackBox>
            </HomeLayout>
        );
    }

    return (
        <HomeLayout bgImage={ReviewsPageBkgImg}>
            <BlackBoxHeader>Reviews</BlackBoxHeader>
            <BlackBox>
                {error && (
                    <div style={{color: 'red', textAlign: 'center', padding: '20px', marginTop: '20px'}}>
                        {error}
                    </div>
                )}
                <div style={{ display: 'flex', gap: '60px', marginBottom: '40px', marginTop: '100px', justifyContent: 'center' }}>
                    <ReviewRing rating={averageRating} maxRating={5} />
                    <RatingDistribution distribution={distribution} />
                </div>

                <ReviewList
                    reviews={reviews}
                    page={page}
                    setPage={setPage}
                    reviewsPerPage={3}
                />
                <LoginToMakeReviewButton />
                <p>&emsp;</p>
                <p>&emsp;</p>
                <ContactUsBox/>
                <Footer/>
            </BlackBox>
        </HomeLayout>
    );
};

export default ReviewsPage;