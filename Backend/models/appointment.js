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
  //added for emailapi
  status: { type: String, enum: ['scheduled', 'in_progress', 'completed'], default: 'scheduled' },
  started_at: { type: Date },
  completed_at: { type: Date }
}, {
  collection: 'events', });

export default mongoose.model('appointments', AppointmentSchema);




