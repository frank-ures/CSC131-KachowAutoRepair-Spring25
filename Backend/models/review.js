import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userFullName: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Stars must be an integer value'
    }
  },
  service: {
    type: String,
    required: true,
    enum: ['Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Repair', 'General Maintenance', 'Other']
  },
  comment: {
    type: String,
    required: false,
    maxLength: 500
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('review', ReviewSchema);