<<<<<<< HEAD
// Import necessary modules
=======
>>>>>>> 2000d88 (SCRUM-61 : Build Appointment Scheduling UI)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
<<<<<<< HEAD
import authRoutes from "./routes/auth.js"; // Import authentication routes
import cors from "cors";

=======
//import "../Frontend/public"
>>>>>>> 2000d88 (SCRUM-61 : Build Appointment Scheduling UI)
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);

// Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    console.log("MongoDB connected");

    // Start the server only after the database is connected
    app.listen(5999, () => {
      console.log("Server started at http://localhost:5999");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit process if database connection fails
  });

// Test route to verify server is running
app.get("/", (req, res) => {
  res.send("Server is working");
});

<<<<<<< HEAD
// Mount authentication routes
app.use("/auth", authRoutes);
=======
>>>>>>> 2000d88 (SCRUM-61 : Build Appointment Scheduling UI)
