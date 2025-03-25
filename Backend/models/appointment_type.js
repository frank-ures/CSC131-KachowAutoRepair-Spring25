import mongoose from 'mongoose';

const AppointmentTypeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: {type: String, required: true},
  price: {type: Number, required: true},
  estimatedTimeInMin: {type: Number, required: true}
});

export default mongoose.model('appointment_types', AppointmentTypeSchema);
