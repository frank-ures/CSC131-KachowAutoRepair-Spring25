import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import { MongoClient } from "mongodb";
import ngrok from '@ngrok/ngrok';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
// mongoUri here so it's available to all routes
const mongoUri = process.env.MONGO_URI;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);

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
    
    // Get current date at midnight for filtering today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log("Querying appointments from:", today.toISOString());
    
    // Query appointments for today and future
    const appointments = await collection.find({
      start_time: { $gte: today.toISOString() }
    }).sort({ start_time: 1 }).toArray();
    
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


