/*

import axios from 'axios';
import Calendly from '../models/calendly.js';

export const createCalendly = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const existingUser = await Calendly.findOne({ email });

        let user;
        if (existingUser) {
            user = await existingUser.save();
        } else {
            user = await Calendly.create({ name, email });
        }

        res.json(user);
    } catch (err) {
        console.error('Error processing Calendly webhook: ', err);
        res.sendStatus(500);
    }
};

export const fetchCalendlyEvent = async (req, res) => {
    try {
      const token = process.env.CALENDLY_ACCESS_TOKEN;
      const headers = { Authorization: `Bearer ${token}` };
  
      const response = await axios.get('https://api.calendly.com/scheduled_events', {
        params: { user: 'https://api.calendly.com/users/user-uri' },
        headers,
      });
  
      const eventDataCollection = response.data.collection;
      let allInvitees = [];
  
      for (const event of eventDataCollection) {
        const inviteesUri = `${event.uri}/invitees`;
        const inviteesResponse = await axios.get(inviteesUri, { headers });
        allInvitees = allInvitees.concat(inviteesResponse.data.collection);
      }
  
      await Calendly.deleteMany({});
      await Calendly.insertMany(allInvitees);
  
      res.status(201).json({ message: 'Events and invitees saved successfully' });
    } catch (error) {
      console.error('Error fetching Calendly events and invitees:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getCalendlyEventById = async (req, res) => {
    try {
      const calendlyId = req.params.calendlyId;
      const calendly = await Calendly.findById(calendlyId);
  
      if (!calendly) {
        return res.status(404).json({ message: 'Calendly not found' });
      }
  
      res.status(200).json(calendly);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const refreshCalendlyEndpoint = async (req, res, next) => {
    try {
      await axios.post('https://localhost:5173/api/booking/calendly');
      next();
    } catch (error) {
      console.error('Error refreshing Calendly endpoint:', error);
      res.status(500).send('Error refreshing Calendly endpoint');
    }
  };
  
  export const getCalendly = async (req, res, next) => {
    try {
      const calendly = await Calendly.find();
      res.status(200).json(calendly);
    } catch (err) {
      next(err);
    }
  };
*/