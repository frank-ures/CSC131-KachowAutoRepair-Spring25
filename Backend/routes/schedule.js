import express from 'express';
import dotenv from 'dotenv';
import Appointment from '../models/appointment.js'; // Import the Appointment model

dotenv.config();
const router = express.Router();

// Search for an appointment by customer email
router.get('/appointment', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const appointments = await Appointment.find({ customerEmail: email });
        if (appointments.length === 0) {
            return res.status(404).json({ error: 'No appointments found for this email' });
        }

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an appointment by ID
router.put('/appointment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const appointment = await Appointment.findByIdAndUpdate(id, updates, { new: true });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({ message: 'Appointment updated successfully', appointment });
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

