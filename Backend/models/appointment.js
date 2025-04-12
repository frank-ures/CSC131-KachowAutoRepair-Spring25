/*
import express from "express";
import mongoose from "mongoose";
import crypto from "crypto";

const router = express.Router();

// Define appointment schema
const appointmentSchema = new mongoose.Schema({
  eventUri: String,
  eventUuid: String,
  eventName: String,
  inviteeName: String,
  inviteeEmail: String,
  startTime: Date,
  endTime: Date,
  duration: Number,
  timezone: String,
  location: String,
  cancellation: {
    type: Boolean,
    default: false
  },
  rescheduled: {
    type: Boolean,
    default: false
  },
  answers: [],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model (if it doesn't already exist in your models directory)
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

// Verify Calendly webhook signature
function verifyCalendlySignature(req) {
  // Get the signature from the headers
  const signature = req.headers['calendly-webhook-signature'];
  if (!signature) return false;
  
  // Your webhook signing key from Calendly
  const signingKey = process.env.CALENDLY_WEBHOOK_KEY;
  
  // Create HMAC using your signing key
  const hmac = crypto.createHmac('sha256', signingKey);
  hmac.update(JSON.stringify(req.body));
  const digest = hmac.digest('hex');

  try {  
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Webhook endpoint for Calendly
router.post('/webhooks/calendly', async (req, res) => {
  try {
    // Verify the webhook signature (for security)
    if (!verifyCalendlySignature(req)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const event = req.body;
    const payload = event.payload;
    
    // Handle different event types
    switch(event.event) {
      case 'invitee.created':
        // New appointment created
        const newAppointment = new Appointment({
          eventUri: payload.event,
          eventUuid: payload.event_uuid,
          eventName: payload.event_type.name,
          inviteeName: payload.invitee.name,
          inviteeEmail: payload.invitee.email,
          startTime: new Date(payload.scheduled_event.start_time),
          endTime: new Date(payload.scheduled_event.end_time),
          timezone: payload.scheduled_event.timezone,
          duration: payload.scheduled_event.duration,
          location: payload.scheduled_event.location?.join(', ') || 'Online',
          answers: payload.questions_and_answers
        });
        
        await newAppointment.save();
        console.log('New appointment saved:', newAppointment.eventUuid);
        break;
        
      case 'invitee.canceled':
        // Appointment canceled
        await Appointment.findOneAndUpdate(
          { eventUuid: payload.event_uuid },
          { cancellation: true }
        );
        console.log('Appointment marked as canceled:', payload.event_uuid);
        break;
        
      case 'invitee.rescheduled':
        // Appointment rescheduled
        await Appointment.findOneAndUpdate(
          { eventUuid: payload.event_uuid },
          {
            rescheduled: true,
            startTime: new Date(payload.scheduled_event.start_time),
            endTime: new Date(payload.scheduled_event.end_time)
          }
        );
        console.log('Appointment rescheduled:', payload.event_uuid);
        break;
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling Calendly webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      cancellation: false 
    }).sort({ startTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get appointments for a specific customer (by email)
router.get('/customer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const appointments = await Appointment.find({ 
      inviteeEmail: email,
      cancellation: false 
    }).sort({ startTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching customer appointments:', error);
    res.status(500).json({ error: 'Failed to fetch customer appointments' });
  }
});

export default router;
*/

import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  apptTypeIds: {type: Array, required: true},
  timeScheduled: {type: String, required: true},
  timeStarted: {type: String, required: true},
  timeComplete: {type: String, required: true},
  totalPrice: {type: Number, required: true},
  customerId: {type: String, required: true},
  mechanicId: {type: String, required: true},
  status: {type: String, required: true},
  notes: {type: String, required: true}
});

export default mongoose.model('appointments', AppointmentSchema);
