// src/HomePages/ReviewsPage/ReviewsPage.jsx
import React, { useState } from 'react';
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

const distributionData = [
    { stars: 5, percentage: 55 },
    { stars: 4, percentage: 30 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
];

const reviewsData = [
    { rating: 5, text: "The team at KAR quickly identified the issue...", name: "John M.", service: "Brake Repair" },
    { rating: 4, text: "I had my brakes replaced here...", name: "Amanda R.", service: "Engine Diagnostics" },
    { rating: 5, text: "I was worried about transmission issues...", name: "Jordan M.", service: "Transmission Service" },
    // more reviews...
];

const ReviewsPage = () => {
    const [page, setPage] = useState(1);

    return (
        <HomeLayout bgImage={ReviewsPageBkgImg}>
            <BlackBoxHeader>Reviews</BlackBoxHeader>
            <BlackBox>
                <div style={{ display: 'flex', gap: '60px', marginBottom: '40px', marginTop: '100px', justifyContent: 'center' }}>
                    <ReviewRing rating={4.8} maxRating={5} />
                    <RatingDistribution distribution={distributionData} />
                </div>

                <ReviewList
                    reviews={reviewsData}
                    page={page}
                    setPage={setPage}
                    reviewsPerPage={3}
                />
                <LoginToMakeReviewButton />
                {/*Fixes layout of button and contactus box*/}
                <p>&emsp;</p>
                <p>&emsp;</p>
                <ContactUsBox/>
                <Footer/>
            </BlackBox>
        </HomeLayout>
    );
};

export default ReviewsPage;