import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

dotenv.config();
const router = express.Router();

// Add this to your auth.js file but don't modify the login route yet
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Add helper function but don't call it yet
const generateAndSendMfaCode = async (user) => {
  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiration (10 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  
  // Save code to user record
  user.verificationCode = {
    code: code,
    expiresAt: expiresAt
  };
  
  await user.save();
  
  // Send email with code
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Verification Code</h2>
        <p>Hello ${user.firstName},</p>
        <p>Your verification code is: ${code}</p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Thanks,<br>Kachow Auto Repair</p>
      </div>
    `
  };
  
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info);
      }
    });
  });
};

// Add this to auth.js
router.post('/test-mfa', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate and send MFA code
    await generateAndSendMfaCode(user);
    
    res.json({ 
      message: 'MFA code sent successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('MFA test error:', error);
    res.status(500).json({ error: 'Failed to send MFA code' });
  }
});

// Add a route to verify a test code
router.post('/verify-test-mfa', async (req, res) => {
  try {
    const { userId, code } = req.body;
    
    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and code are required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.verificationCode || !user.verificationCode.code) {
      return res.status(400).json({ error: 'No verification code found' });
    }
    
    if (new Date() > new Date(user.verificationCode.expiresAt)) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }
    
    if (user.verificationCode.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    // Clear the code after successful verification
    user.verificationCode = { code: null, expiresAt: null };
    await user.save();
    
    res.json({ message: 'Verification successful' });
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ error: 'Failed to verify MFA code' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role, hourlyWage } = req.body;
    
    if (!username || !email || !password) {
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
      hourlyWage,
      emailVerified: false,          // Add this
      registrationComplete: false,    // Add this
      mfaEnabled: true               // Add this
    });
    
    await user.save();
    
    // Generate and send verification code
    try {
      await generateAndSendMfaCode(user);
      
      res.status(201).json({ 
        message: 'Registration initiated. Please verify your email.',
        userId: user._id
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // If email fails, we'll still create the account but inform the user
      res.status(201).json({ 
        message: 'Registration successful but verification email failed to send. Please contact support.',
        userId: user._id
      });
    }
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

// Update your existing login route
router.post('/login', async (req, res) => {
  User.mfaEnabled = true;
  try {
      const { email, password, mfaCode } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if MFA is enabled and if there's an MFA code provided
      if (user.mfaEnabled) {
          if (!mfaCode) {
              // No MFA code provided, send one
              await generateAndSendMfaCode(user);
              
              return res.status(200).json({
                  requireMfa: true,
                  userId: user._id,
                  message: 'Authentication code sent to your email.'
              });
          } else {
              // MFA code provided, verify it
              if (!user.verificationCode || !user.verificationCode.code) {
                  return res.status(400).json({ error: 'No verification code found' });
              }
              
              if (new Date() > new Date(user.verificationCode.expiresAt)) {
                  return res.status(400).json({ error: 'Verification code has expired' });
              }
              
              if (user.verificationCode.code !== mfaCode) {
                  return res.status(400).json({ error: 'Invalid verification code' });
              }
              
              // Clear the code after successful verification
              user.verificationCode = { code: null, expiresAt: null };
              await user.save();
          }
      }

      // Generate JWT token
      const payload = {
          userId: user._id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
      };

      const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      // Send back user info and token
      res.json({ 
          user, 
          role: user.role, 
          token 
      });
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

    const resetLink = `${process.env.FRONTEND_BASE_URL}/resetPassword.html?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true", // true for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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
// Route to verify MFA code for email verification
router.post('/verify-email', async (req, res) => {
  try {
    const { userId, code } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if code exists and is valid
    if (!user.verificationCode || !user.verificationCode.code) {
      return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
    }

    // Check if code has expired
    if (new Date() > new Date(user.verificationCode.expiresAt)) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Check if code matches
    if (user.verificationCode.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update user status
    user.emailVerified = true;
    user.registrationComplete = true;
    user.verificationCode = { code: null, expiresAt: null }; // Clear the code
    await user.save();

    // Generate JWT token
    const payload = {
      userId: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return success with token and user info
    res.json({
      message: 'Email verified successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// Route to resend verification code
router.post('/resend-verification', async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate and send a new MFA code
    await generateAndSendMfaCode(user);

    res.json({
      message: 'Verification code sent. Please check your email.'
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});
// Add this new route to your auth.js file
router.post('/login-with-mfa', async (req, res) => {
  try {
    const { email, password, mfaCode } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // MFA approach
    if (!mfaCode) {
      // No MFA code provided - generate one and send it
      await generateAndSendMfaCode(user);
      
      return res.status(200).json({
        requireMfa: true,
        userId: user._id,
        message: 'Authentication code sent to your email'
      });
    } else {
      // MFA code provided - verify it
      if (!user.verificationCode || !user.verificationCode.code) {
        return res.status(400).json({ error: 'No verification code found' });
      }
      
      if (new Date() > new Date(user.verificationCode.expiresAt)) {
        return res.status(400).json({ error: 'Verification code has expired' });
      }
      
      if (user.verificationCode.code !== mfaCode) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
      
      // MFA verified successfully
      
      // Clear the code
      user.verificationCode = { code: null, expiresAt: null };
      await user.save();
      
      // Generate JWT token
      const payload = {
        userId: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ 
        user, 
        role: user.role, 
        token 
      });
    }
  } catch (error) {
    console.error('MFA login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
export default router;