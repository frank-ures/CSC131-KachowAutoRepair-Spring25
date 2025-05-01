// routes/appointmentRoutes.js
import express from 'express';
import dotenv from 'dotenv';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import AppointmentType from '../models/appointment_type.js';

dotenv.config();
const router = express.Router();

// Get all appointment types
router.get('/appointment-types', async (req, res) => {
  try {
    const appointmentTypes = await AppointmentType.find();
    res.json(appointmentTypes);
  } catch (err) {
    console.error('GET /appointment-types error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;