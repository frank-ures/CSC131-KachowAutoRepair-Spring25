import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vin: {type: String, required: true},
  licensePlate: {type: String, required: true},
  year: {type: Number, required: true},
  make: {type: String, required: true},
  model: {type: String, required: true},
  customerId: {type: String, required: true}
});

export default mongoose.model('vehicles', VehicleSchema);
