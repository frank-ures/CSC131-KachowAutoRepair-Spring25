import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: {type: String, required: true},
  appointmentId: {type: String, required: true},
  stars: {type: Number, required: true},
  comment: {type: String, required: true}
});

export default mongoose.model('reviews', ReviewSchema);
