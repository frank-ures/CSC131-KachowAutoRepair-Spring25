import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ['customer', 'mechanic', 'admin'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed passwords
  hourlyWage: { type: Number, default: 0 },
  vehicleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'vehicle' }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appointment' }],
  //added for password reset
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

export default mongoose.model('user', UserSchema);
