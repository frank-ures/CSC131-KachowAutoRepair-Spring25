import mongoose from 'mongoose';
import User from './models/user.js';
import Vehicle from './models/vehicle.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Install with `npm install node-fetch@2`

dotenv.config();


// ***** Test database connection
const MONGO_URI = 'mongodb+srv://frankures:T2Xp0segAjyg2UYx@cluster0.hre7j.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0'; 

/*mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
.catch(error => console.error('MongoDB connection error:', error));*/

// ***** Test registration API
const registerUser = async () => {
  const response = await fetch("http://localhost:5999/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Jane",
      lastName: "Doe",
      username: 'JaneD',
      email: 'janedoe@example.com',
      password: 'password123',
      role: "customer",
      hourlyWage: 0
    }),
  });
  const data = await response.json();
  console.log("Register Response:", data);
};
  
// ***** Test login API
const loginUser = async () => {
  const response = await fetch("http://localhost:5999/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: 'janedoe@example.com',
      password: 'password123'
    }),
  });
  const data = await response.json();
  console.log("Login Response:", data);
};

registerUser();
loginUser();
