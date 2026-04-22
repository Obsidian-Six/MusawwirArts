import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../Models/UserModel.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // 1. Basic Presence Check
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existingUser = await User.findOne({ email }).select('_id');
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Account already exists with this email.' 
      });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  }catch (e) {
    console.error("REGISTRATION ERROR:", e); 
    res.status(500).json({ error: 'Server error during registration' });
  } 
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT (Use your .env secret)
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1d' }
    );

    res.json({ 
      success: true, 
      token,
      user: { email: user.email } // Don't send the hashed password back!
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.post('/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Both passwords are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save(); // pre-save hook will hash the new password

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

export default router;