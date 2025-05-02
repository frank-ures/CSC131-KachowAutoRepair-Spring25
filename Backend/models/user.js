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
  // Appointments were saved as a string in the database breaking login somehow
  //appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appointment' }],
  appointments: { 
    type: mongoose.Schema.Types.Mixed, 
    default: []
  },
  //added for password reset
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  // MFA fields - added
  mfaEnabled: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  verificationCode: {
    code: { type: String },
    expiresAt: { type: Date }
  }
});

export default mongoose.model('user', UserSchema);