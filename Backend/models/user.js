import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed passwords
  role: { type: String, enum: ['customer', 'mechanic', 'admin'], required: true },
  hourlyWage: { type: Number, default: 0 },
  vehicleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' }],
  appointmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appointment' }]
});

export default mongoose.model('users', UserSchema);
