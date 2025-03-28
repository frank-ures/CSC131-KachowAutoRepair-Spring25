import express from 'express';
import dotenv from 'dotenv';
import Appointment from '../models/appointment.js'; // Import the Appointment model

dotenv.config();
const router = express.Router();

// Update an appointment by ID
router.put('/appointment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { timeScheduled } = req.body; // Extract timeScheduled from the request body

        if (!timeScheduled) {
            return res.status(400).json({ error: 'timeScheduled is required' });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { timeScheduled }, // Update only the timeScheduled field
            { new: true } // Return the updated document
        );

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an appointment by ID
router.delete('/appointment/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByIdAndDelete(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

