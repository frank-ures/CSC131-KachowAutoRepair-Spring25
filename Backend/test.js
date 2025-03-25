import mongoose from 'mongoose';
import User from './models/user.js';
import Vehicle from './models/vehicle.js';

const MONGO_URI = 'mongodb+srv://frankures:T2Xp0segAjyg2UYx@cluster0.hre7j.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0'; 

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      const users = await User.find();
      const vehicles = await Vehicle.find();
      console.log('Users:', users);
      console.log('Vehicles:', vehicles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(error => console.error('MongoDB connection error:', error));
