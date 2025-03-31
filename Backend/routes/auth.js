import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
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
      console.error("Registration error:", error);
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
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();

    const resetLink = `http://localhost:5500/reset-password.html?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 30 minutes.</p>`
    });

    res.json({ message: 'Password reset link sent to your email' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send reset link' });
  }
});
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});
export default router;