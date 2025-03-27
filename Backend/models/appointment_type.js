import mongoose from 'mongoose';

const AppointmentTypeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  priceMin: {type: Number, required: true},
  priceMax: {type: Number, required: true},
  timeMin: {type: Number, required: true},
  timeMax: {type: Number, required: true}
});

export default mongoose.model('appointment_types', AppointmentTypeSchema);
