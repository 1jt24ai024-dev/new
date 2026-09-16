const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper to get or create the single owner record
async function getOwner() {
  let user = await User.findOne({});
  if (!user) {
    const email = process.env.ADMIN_EMAIL || 'admin@siddarth.com';
    user = await User.create({ email });
  }
  return user;
}

// GET /api/auth/status
router.get('/status', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Authentication database is unavailable' });
  }
  try {
    const user = await getOwner();
    res.json({ isSetup: true, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Error checking auth status', error: err.message });
  }
});

// POST /api/auth/login - standard email/password login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await getOwner();
    
    // Check if passwords match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || user.email !== email) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    res.json({ success: true, token: jwtToken, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Authentication error', error: err.message });
  }
});

// GET /api/auth/verify - check stored token validity
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
