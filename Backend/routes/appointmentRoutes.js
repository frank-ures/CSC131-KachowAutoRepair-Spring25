
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






/*
import express from 'express';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import Appointment from '../models/appointment.js';

const router = express.Router();

// Get all appointments (admin and auth users)
router.get('/appointments', authenticateUser, async (req, res) => {
  try {
    // Optionally filter by date range if provided in query params
    const query = {};
    
    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      query.start_time = { 
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Status filtering
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Mechanic specific filtering (if not admin)
    if (req.query.mechanicId) {
      query.mechanicId = req.query.mechanicId;
    } else if (req.user.role === 'mechanic') {
      // If user is a mechanic and no specific mechanicId requested,
      // only show their own appointments
      query.mechanicId = req.user.userId;
    }
    
    const appointments = await Appointment.find(query).sort({ start_time: 1 });
    res.json(appointments);
  } catch (err) {
    console.error('GET /appointments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments for a specific date
router.get('/appointments/date/:date', authenticateUser, async (req, res) => {
  try {
    const dateParam = req.params.date; // YYYY-MM-DD format
    
    // Create date range for the selected day
    const startOfDay = new Date(dateParam);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(dateParam);
    endOfDay.setHours(23, 59, 59, 999);
    
    const query = {
      start_time: { 
        $gte: startOfDay,
        $lte: endOfDay
      }
    };
    
    // If user is a mechanic, filter to only show their appointments
    if (req.user.role === 'mechanic') {
      query.mechanicId = req.user.userId;
    }
    
    const appointments = await Appointment.find(query).sort({ start_time: 1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments for date:', err);
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
    
    const appointments = await Appointment.find({ mechanicId: req.user.userId }).sort({ start_time: 1 });
    res.json(appointments);
  } catch (err) {
    console.error('GET /appointments/my-appointments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current in-progress appointment
router.get("/appointments/current", authenticateUser, async (req, res) => {
  try {
    const query = { status: "in_progress" };
    
    // If user is a mechanic, only show their in-progress appointment
    if (req.user.role === 'mechanic') {
      query.mechanicId = req.user.userId;
    }
    
    const currentAppointment = await Appointment.findOne(query);
    
    if (!currentAppointment) {
      return res.status(200).json({ message: "No appointment currently in progress" });
    }
    
    res.status(200).json(currentAppointment);
  } catch (error) {
    console.error("Error fetching current appointment:", error);
    res.status(500).send("Error fetching current appointment");
  }
});

// Get appointments for a customer by email
router.get('/appointments/history', authenticateUser, async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    
    // Find all appointments for this customer email
    const appointments = await Appointment.find({ 
      invitee_email: email 
    }).sort({ start_time: -1 }); // Sort by start time, newest first
    
    console.log(`Found ${appointments.length} appointments for email: ${email}`);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching customer appointment history:', error);
    res.status(500).json({ error: 'Failed to fetch appointment history' });
  }
});

// Start an appointment
router.post("/appointments/start", authenticateUser, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    if (!appointmentId) {
      return res.status(400).send("Appointment ID is required");
    }
    
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && 
        appointment.mechanicId && 
        appointment.mechanicId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    
    appointment.status = 'in_progress';
    appointment.started_at = new Date();
    
    // If no mechanic assigned and current user is a mechanic, assign it
    if (!appointment.mechanicId && req.user.role === 'mechanic') {
      appointment.mechanicId = req.user.userId;
    }
    
    await appointment.save();
    
    res.status(200).json({ message: "Appointment started successfully" });
  } catch (error) {
    console.error("Error starting appointment:", error);
    res.status(500).send("Error updating appointment status");
  }
});

// Complete an appointment
router.post("/appointments/complete", authenticateUser, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    if (!appointmentId) {
      return res.status(400).send("Appointment ID is required");
    }
    
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && 
        appointment.mechanicId && 
        appointment.mechanicId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    
    appointment.status = 'completed';
    appointment.completed_at = new Date();
    
    await appointment.save();
    
    res.status(200).json({ message: "Appointment completed successfully" });
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).send("Error updating appointment status");
  }
});

// Assign mechanic to appointment (admin only)
router.post('/appointments/:id/assign', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { mechanicId } = req.body;
    const appointmentId = req.params.id;
    
    if (!mechanicId) {
      return res.status(400).json({ message: 'Mechanic ID is required' });
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { mechanicId: mechanicId },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ 
      message: 'Mechanic assigned successfully',
      appointment
    });
  } catch (err) {
    console.error('Error assigning mechanic:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
*/






