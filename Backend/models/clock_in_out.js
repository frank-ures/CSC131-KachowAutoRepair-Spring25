import mongoose from 'mongoose';

const ClockInOutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    isClockIN: { type: Boolean, required: true },
    clockTime: { type: String, required: true },
    wageApplied: { type: Number, required: true }
});

export default mongoose.model('clock_in_out', ClockInOutSchema);