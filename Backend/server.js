import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import { MongoClient } from "mongodb";
import ngrok from '@ngrok/ngrok';
import fetch from 'node-fetch';
import reviewRoutes from "./routes/reviews.js";

dotenv.config();

const app = express();
// mongoUri here so it's available to all routes
const mongoUri = process.env.MONGO_URI;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000'
// }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Allow cookies if needed
}));
// app.use(cors()); // commented out to resolve conflict
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);
app.use('/api', userRoutes);

// Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    console.log("MongoDB connected");

    app.listen(5999, async () => {
      console.log("Server started at http://localhost:5999");

      try {
        // Start Ngrok session and await for the public URL
        const ngrokSession = await ngrok.connect({
          addr: 5999,
          authtoken: process.env.NGROK_AUTHTOKEN,
        });

        // Log the ngrok session details for debugging
        console.log('Ngrok session details:', ngrokSession);

        if (ngrokSession && ngrokSession.url) {
          const url = ngrokSession.url(); // Extract the public URL from ngrokSession
          console.log(`Ngrok tunnel opened at: ${url}`);

          const webhookUrl = `${url}/webhook/calendly`;
          const calendlyOrg = 'https://api.calendly.com/organizations/b64d9930-0b44-4ee8-962e-ea4c0d0fafda';

          const response = await fetch('https://api.calendly.com/webhook_subscriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
            },
            body: JSON.stringify({
              url: webhookUrl, // This is the URL that Calendly will send data to
              events: ['invitee.created'], // Specify events you want to subscribe to
              organization: calendlyOrg,
              scope: 'organization', // Use 'organization' scope for organization-level webhooks
            }),
          });

          const data = await response.json();
          console.log('Calendly webhook registered:', data);

          if (!response.ok) {
            console.error('Failed to register webhook:', data);
          }
        } else {
          console.error('Error: Ngrok session did not return a public URL');
        }
      } catch (error) {
        console.error("Error starting Ngrok:", error);
      }
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

// Mount authentication routes
app.use("/auth", authRoutes);

// API endpoint to get appointments
app.get("/api/appointments", async (req, res) => {
  let mongoClient;
  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    console.log("Connected to MongoDB for fetching appointments");
    
    const db = mongoClient.db("calendarDB");
    const collection = db.collection("events");
    
    // gets all appointments then filters by date in frontend for displaying
    const appointments = await collection.find({}).sort({ start_time: 1 }).toArray();
    
    console.log("Found appointments:", appointments.length);
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send("Error fetching appointments");
  } finally {
    if (mongoClient) {
      await mongoClient.close();
      console.log("MongoDB connection closed");
    }
  }

});

//------------ Calendly Webhook Handler ------------
app.post("/webhook/calendly", async (req, res) => {
  console.log('webhook hit');
  try {
    const payload = req.body.payload;
    
    if (!payload) {
      console.error("Missing payload in webhook data");
      return res.status(400).send("Missing payload");
    }

    // Create a properly formatted document
    const mappedData = {
      event_type: payload.scheduled_event.name, // Getting the name of the event type
      invitee_name: payload.name,
      invitee_email: payload.email,
      start_time: payload.scheduled_event.start_time,
      end_time: payload.scheduled_event.end_time,
    };

    // Process the questions and answers to get the vehicle details
    const answers = payload.questions_and_answers || [];
    for (const item of answers) {
      const question = item.question.toLowerCase();
      
      if (question.includes("vehicle make")) {
        mappedData.vehicle_make = item.answer;
      } else if (question.includes("vehicle model")) {
        mappedData.vehicle_model = item.answer;
      } else if (question.includes("vehicle year")) {
        mappedData.vehicle_year = item.answer;
      } else if (question.includes("license plate")) {
        mappedData.vehicle_license_plate = item.answer;
      } else if (question.includes("anything") || question.includes("prepare")) {
        mappedData.other_information = item.answer;
      }
    }

    // Save the mapped data to MongoDB
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db("calendarDB");
    const collection = db.collection("events");

    // Insert the event data
    const result = await collection.insertOne(mappedData);
    console.log("Saved appointment data to MongoDB:", result.insertedId);

    // Close the MongoDB connection
    await client.close();

    // Respond to Calendly to acknowledge receipt
    res.status(200).send("Event data received and saved");
  } catch (error) {
    console.error("Error processing Calendly webhook:", error);
    // Log the request body on error for debugging
    if (req.body) {
      console.error("Request payload structure:", JSON.stringify(req.body, null, 2));
    }
    res.status(500).send("Error saving to MongoDB");
  }
});

// Endpoint to start an appointment
app.post("/api/appointments/start", async (req, res) => {
  let mongoClient;
  try {
    const { appointmentId, status } = req.body;
    
    if (!appointmentId) {
      return res.status(400).send("Appointment ID is required");
    }
    
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    
    const db = mongoClient.db("calendarDB");
    const collection = db.collection("events");
    
    // Update the appointment with the new status
    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(appointmentId) },
      { $set: { status: status, started_at: new Date().toISOString() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).send("Appointment not found");
    }
    
    console.log(`Appointment ${appointmentId} updated to status: ${status}`);
    res.status(200).json({ message: "Appointment status updated successfully" });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).send("Error updating appointment status");
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
});

// Endpoint to complete an appointment
app.post("/api/appointments/complete", async (req, res) => {
  let mongoClient;
  try {
    const { appointmentId, status } = req.body;
    
    if (!appointmentId) {
      return res.status(400).send("Appointment ID is required");
    }
    
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    
    const db = mongoClient.db("calendarDB");
    const collection = db.collection("events");
    
    // Update the appointment with the new status
    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(appointmentId) },
      { $set: { status: status, completed_at: new Date().toISOString() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).send("Appointment not found");
    }
    
    console.log(`Appointment ${appointmentId} updated to status: ${status}`);
    res.status(200).json({ message: "Appointment status updated successfully" });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).send("Error updating appointment status");
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
});

// Endpoint to get current in-progress appointment for customer overview
app.get("/api/appointments/current", async (req, res) => {
  let mongoClient;
  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    
    const db = mongoClient.db("calendarDB");
    const collection = db.collection("events");
    
    // Find the current in-progress appointment
    const currentAppointment = await collection.findOne({ status: "in_progress" });
    
    if (!currentAppointment) {
      return res.status(200).json({ message: "No appointment currently in progress" });
    }
    
    res.status(200).json(currentAppointment);
  } catch (error) {
    console.error("Error fetching current appointment:", error);
    res.status(500).send("Error fetching current appointment");
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
});

app.get('/api/appointments/history', async (req, res) => {
  let mongoClient;
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    console.log("Connected to MongoDB for fetching appointment history");
    
    const db = mongoClient.db("calendarDB");
    const collection = db.collection("events");
    
    // Find all appointments for this customer email
    const appointments = await collection.find({ 
      invitee_email: email 
    }).sort({ start_time: -1 }).toArray(); // Sort by start time, newest first
    
    console.log(`Found ${appointments.length} appointments for email: ${email}`);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching customer appointment history:', error);
    res.status(500).json({ error: 'Failed to fetch appointment history' });
  } finally {
    if (mongoClient) {
      await mongoClient.close();
      console.log("MongoDB connection closed after history fetch");
    }
  }
});
