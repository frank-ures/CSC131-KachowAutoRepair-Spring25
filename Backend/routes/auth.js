import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
      const { firstName, lastName, username, email, password, role, hourlyWage } = req.body;
      
      if ( !username || !email || !password ) {
          return res.status(400).json({ error: 'All fields required' });
        }
        
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role,
        hourlyWage
    });
      await user.save();
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/logout', (req, res) => {
    /* 
        Additional cleanup as necessary
     */
    res.clearCookie('token').send('Logged out successfully');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;