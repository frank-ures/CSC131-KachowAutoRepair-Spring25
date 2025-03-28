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
