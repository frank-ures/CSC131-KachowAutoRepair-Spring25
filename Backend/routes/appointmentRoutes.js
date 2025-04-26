// routes/appointmentRoutes.js
import express from 'express';
import dotenv from 'dotenv';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import Appointment from '../models/appointment.js';

dotenv.config();
const router = express.Router();

// Get all appointments (admin only)
router.get('/appointments', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    console.error('GET /appointments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments for the logged-in mechanic
router.get('/appointments/my-appointments', authenticateUser, async (req, res) => {
  try {
    // Only mechanics and admins can view appointments
    if (req.user.role !== 'mechanic' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view appointments' });
    }
    
    const appointments = await Appointment.find({ mechanicId: req.user.userId });
    res.json(appointments);
  } catch (err) {
    console.error('GET /appointments/my-appointments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments for a specific mechanic
router.get('/appointments/mechanic/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if requesting user is admin or the mechanic themselves
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      return res.status(403).json({ message: 'Not authorized to view these appointments' });
    }
    
    const appointments = await Appointment.find({ mechanicId: id });
    res.json(appointments);
  } catch (err) {
    console.error('GET /appointments/mechanic/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments for a specific date range
router.get('/appointments/range', authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate, mechanicId, status } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    
    // Build query object starting with date range
    // Note: this assumes timeScheduled is stored in ISO format string
    const query = {
      timeScheduled: { 
        $gte: new Date(startDate).toISOString(), 
        $lte: new Date(endDate).toISOString() 
      }
    };
    
    if (mechanicId) {
      query.mechanicId = mechanicId;
    } else if (req.user.role !== 'admin') {
      // Non-admin users can only see their own appointments
      query.mechanicId = req.user.userId;
    }
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query);
    res.json(appointments);
  } catch (err) {
    console.error('GET /appointments/range error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task completion summary for a date range
router.get('/appointments/tasks-summary', authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate, mechanicId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    
    // Determine which mechanic ID to use
    const targetMechanicId = mechanicId || req.user.userId;
    
    // Non-admin users can only see their own data
    if (req.user.role !== 'admin' && targetMechanicId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this data' });
    }
    
    // Query for appointments in the date range
    const query = {
      timeScheduled: { 
        $gte: new Date(startDate).toISOString(), 
        $lte: new Date(endDate).toISOString() 
      },
      mechanicId: targetMechanicId
    };
    
    const appointments = await Appointment.find(query);
    
    // Calculate task summary
    const completedTasks = appointments.filter(appt => appt.status === 'complete').length;
    const totalTasks = appointments.length;
    
    res.json({
      completedTasks,
      totalTasks,
      dateRange: {
        startDate,
        endDate
      },
      mechanicId: targetMechanicId
    });
  } catch (err) {
    console.error('GET /appointments/tasks-summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;