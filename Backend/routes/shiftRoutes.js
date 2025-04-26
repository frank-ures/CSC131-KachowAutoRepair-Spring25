import express from 'express';
import dotenv from 'dotenv';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import Shift from '../models/shift.js';
import User from '../models/user.js';

dotenv.config();
const router = express.Router();

// Get all shifts (admin only)
router.get('/shifts', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const shifts = await ClockInOut.find().populate('mechanicId', 'firstName lastName');
    res.json(shifts);
  } catch (err) {
    console.error('GET /shifts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shifts for a specific mechanic
router.get('/shifts/mechanic/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if requesting user is admin or the mechanic themselves
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      return res.status(403).json({ message: 'Not authorized to view these shifts' });
    }
    
    const shifts = await Shift.find({ mechanicId: id }).sort({ startTime: 1 });
    res.json(shifts);
  } catch (err) {
    console.error('GET /shifts/mechanic/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shifts for the currently logged-in mechanic
router.get('/shifts/my-shifts', authenticateUser, async (req, res) => {
  try {
    // Only mechanics and admins can view shifts
    if (req.user.role !== 'mechanic' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view shifts' });
    }
    
    const shifts = await Shift.find({ mechanicId: req.user.userId }).sort({ startTime: 1 });
    res.json(shifts);
  } catch (err) {
    console.error('GET /shifts/my-shifts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shifts for a specific date range
router.get('/shifts/range', authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    
    const shifts = await Shift.find({
      startTime: { $gte: new Date(startDate) },
      endTime: { $lte: new Date(endDate) }
    }).populate('mechanicId', 'firstName lastName');
    
    res.json(shifts);
  } catch (err) {
    console.error('GET /shifts/range error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new shift
router.post('/shifts', authenticateUser, async (req, res) => {
  try {
    const { mechanicId, startTime, endTime, wageThisShift } = req.body;
    
    // Validate mechanic exists
    const mechanic = await User.findById(mechanicId);
    if (!mechanic || mechanic.role !== 'mechanic') {
      return res.status(400).json({ message: 'Invalid mechanic ID' });
    }
    
    // Validate times
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    if (startDate >= endDate) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }
    
    // Check for overlapping shifts
    const overlappingShifts = await Shift.find({
      mechanicId,
      $or: [
        { startTime: { $lt: endDate }, endTime: { $gt: startDate } }
      ]
    });
    
    if (overlappingShifts.length > 0) {
      return res.status(400).json({ message: 'Shift overlaps with existing shifts' });
    }
    
    // Create the shift
    const newShift = new Shift({
      mechanicId,
      startTime: startDate,
      endTime: endDate,
      wageThisShift
    });
    
    await newShift.save();
    res.status(201).json(newShift);
  } catch (err) {
    console.error('POST /shifts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a shift (admin only)
router.put('/shifts/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { mechanicId, startTime, endTime, notes } = req.body;
    
    // Find the shift
    const shift = await Shift.findById(id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    // Update fields if provided
    if (mechanicId) {
      // Validate mechanic exists
      const mechanic = await User.findById(mechanicId);
      if (!mechanic || mechanic.role !== 'mechanic') {
        return res.status(400).json({ message: 'Invalid mechanic ID' });
      }
      shift.mechanicId = mechanicId;
    }
    
    let startDate = shift.startTime;
    let endDate = shift.endTime;
    
    if (startTime) {
      startDate = new Date(startTime);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ message: 'Invalid start time format' });
      }
      shift.startTime = startDate;
    }
    
    if (endTime) {
      endDate = new Date(endTime);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid end time format' });
      }
      shift.endTime = endDate;
    }
    
    // Validate times
    if (startDate >= endDate) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }
    
    // Check for overlapping shifts (excluding this shift)
    const overlappingShifts = await Shift.find({
      _id: { $ne: id },
      mechanicId: shift.mechanicId,
      $or: [
        { startTime: { $lt: endDate }, endTime: { $gt: startDate } }
      ]
    });
    
    if (overlappingShifts.length > 0) {
      return res.status(400).json({ message: 'Shift overlaps with existing shifts' });
    }
    
    if (notes !== undefined) {
      shift.notes = notes;
    }
    
    await shift.save();
    res.json(shift);
  } catch (err) {
    console.error('PUT /shifts/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a shift (admin only)
router.delete('/shifts/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Shift.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    res.json({ message: 'Shift deleted successfully' });
  } catch (err) {
    console.error('DELETE /shifts/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;