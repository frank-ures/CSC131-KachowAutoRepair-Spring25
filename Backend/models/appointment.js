import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  event_type: { type: String },
  invitee_name: { type: String },
  invitee_email: { type: String },
  start_time: { type: String },
  end_time: { type: String },
  vehicle_make: { type: String },
  vehicle_model: { type: String },
  vehicle_year: { type: String },
  vehicle_license_plate: { type: String },
  other_information: { type: String },
}, {
  collection: 'events', });

export default mongoose.model('appointments', AppointmentSchema);




/*
import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  // Event and scheduling information
  event_type: { 
    type: String,
    required: true 
  },
  start_time: { 
    type: Date,
    required: true 
  },
  end_time: { 
    type: Date,
    required: true 
  },
  
  // Customer information
  invitee_name: { 
    type: String,
    required: true 
  },
  invitee_email: { 
    type: String,
    required: true 
  },
  
  // Vehicle information
  vehicle_make: { 
    type: String 
  },
  vehicle_model: { 
    type: String 
  },
  vehicle_year: { 
    type: String 
  },
  vehicle_license_plate: { 
    type: String 
  },
  
  // Additional information
  other_information: { 
    type: String 
  },
  
  // Appointment status tracking
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  // Timestamps for status changes
  started_at: { 
    type: Date 
  },
  completed_at: { 
    type: Date 
  },
  
  // Optional mechanic assignment
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  collection: 'events',
  timestamps: true // Adds createdAt and updatedAt fields
});

export default mongoose.model('appointments', AppointmentSchema);
*/




