import express from 'express';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();
const router = express.Router();

router.put('/employee/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: { hourlyWage: req.body.hourlyWage } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('PUT /employee/:id error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/employees', async (req, res) => {
    try {
        const users = await User.find({ role: 'mechanic' });

        if (!users) {
            return res.status(404).json({ message: 'Employees not found' });
        }

        res.json(users);
    } catch (err) {
        console.error('GET /employees error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

