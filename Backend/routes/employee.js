import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js'; 

dotenv.config();
const router = express.Router();

// Create a new mechanic
router.post('/mechanic', async (req, res) => {
    try {
        const { firstName, lastName, username, email, hourlyWage } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !username || !email || !hourlyWage) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Set the role to "mechanic"
        const role = "mechanic";

        // Create a new mechanic document
        const mechanic = new User({ firstName, lastName, username, email, role, hourlyWage });
        await mechanic.save();

        res.status(201).json({ message: 'Mechanic created successfully', mechanic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create mechanic' });
    }
});

// List all mechanics
router.get('/mechanics', async (req, res) => {
    try {
        // Find all users with the role "mechanic"
        const mechanics = await User.find({ role: "mechanic" });
        res.json(mechanics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve mechanics' });
    }
});

// Delete a mechanic by ID
router.delete('/mechanic/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the mechanic by ID
        const mechanic = await User.findOneAndDelete({ _id: id, role: "mechanic" });
        if (!mechanic) {
            return res.status(404).json({ error: 'Mechanic not found' });
        }

        res.json({ message: 'Mechanic deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete mechanic' });
    }
});

export default router;