import express from 'express';
import Review from '../models/review.js';

const router = express.Router();

// POST route to create a new review
router.post('/', async (req, res) => {
    try {
        // create a new review using Mongoose
        const review = new Review({
            userFullName: req.body.userFullName,
            stars: req.body.stars,
            service: req.body.service,
            comment: req.body.comment
            // date will be added automatically by the schema default
        });

        // Save the review to MongoDB
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error('Error saving review:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to save review' });
    }
});

// GET route to fetch all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({})
            .sort({ date: -1 }); // Sort by date, newest first

        // Calculate average rating
        const totalReviews = reviews.length;
        const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
        const averageRating = totalReviews > 0 ? totalStars / totalReviews : 0;

        // Calculate distribution
        const distribution = [5, 4, 3, 2, 1].map(stars => {
            const count = reviews.filter(review => review.stars === stars).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return { stars, percentage };
        });

        res.json({
            reviews,
            averageRating,
            distribution
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});


export default router;