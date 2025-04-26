// models/shift.js
import mongoose from 'mongoose';

const ShiftSchema = new mongoose.Schema({
  mechanicId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  wageThisShift: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // This automatically updates the createdAt and updatedAt fields

ShiftSchema.methods.getDuration = function() {
  const durationMs = this.endTime - this.startTime;
  return durationMs / (1000 * 60 * 60); // Convert ms to hours
};

ShiftSchema.pre('save', function(next) {
  if (this.startTime >= this.endTime) {
    return next(new Error('End time must be after start time'));
  }
  next();
});

export default mongoose.model('shift', ShiftSchema);