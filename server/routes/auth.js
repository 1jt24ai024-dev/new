const express = require('express');
const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper to get or create the single owner record
async function getOwner() {
  let user = await User.findOne({});
  if (!user) {
    const email = process.env.ADMIN_EMAIL || 'ns.siddarth@icloud.com';
    user = await User.create({ email });
  }
  return user;
}

// GET /api/auth/status - check if TOTP is configured, return QR if first time
router.get('/status', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Authentication database is unavailable' });
  }

  try {
    const user = await getOwner();

    if (user.isTotpSetup && user.totpSecret) {
      return res.json({ isSetup: true, email: user.email });
    }

    // First time: generate temporary secret and QR code
    let secretBase32 = user.tempTotpSecret;
    let otpauthUrl;

    if (!secretBase32) {
      const secret = speakeasy.generateSecret({
        name: `N S Siddarth Portfolio (${user.email || 'Owner'})`,
        issuer: 'N S Siddarth Portfolio',
        length: 20,
      });
      secretBase32 = secret.base32;
      otpauthUrl = secret.otpauth_url;
      user.tempTotpSecret = secretBase32;
      await user.save();
    } else {
      otpauthUrl = `otpauth://totp/N%20S%20Siddarth%20Portfolio:${encodeURIComponent(user.email || 'Owner')}?secret=${secretBase32}&issuer=N%20S%20Siddarth%20Portfolio`;
    }

    const qrCode = await QRCode.toDataURL(otpauthUrl);

    res.json({
      isSetup: false,
      email: user.email,
      qrCode,
      secret: secretBase32,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error checking auth status', error: err.message });
  }
});

// POST /api/auth/regenerate-qr - re-generate a fresh QR code if user requests before setup
router.post('/regenerate-qr', async (req, res) => {
  try {
    const user = await getOwner();
    if (user.isTotpSetup && user.totpSecret) {
      return res.status(400).json({ message: 'TOTP is already set up' });
    }

    const secret = speakeasy.generateSecret({
      name: `N S Siddarth Portfolio (${user.email || 'Owner'})`,
      issuer: 'N S Siddarth Portfolio',
      length: 20,
    });
    user.tempTotpSecret = secret.base32;
    await user.save();

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      isSetup: false,
      email: user.email,
      qrCode,
      secret: secret.base32,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error regenerating QR', error: err.message });
  }
});

// POST /api/auth/setup-totp - verify the first code to complete TOTP registration
router.post('/setup-totp', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Verification code is required' });

    const user = await getOwner();
    if (!user.tempTotpSecret) {
      return res.status(400).json({ message: 'No setup in progress. Please refresh.' });
    }

    const cleanToken = String(token).trim().replace(/\s+/g, '');

    const verified = speakeasy.totp.verify({
      secret: user.tempTotpSecret,
      encoding: 'base32',
      token: cleanToken,
      window: 2, // Allow slight time drift
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid 6-digit code. Ensure time is synchronized.' });
    }

    user.totpSecret = user.tempTotpSecret;
    user.tempTotpSecret = null;
    user.isTotpSetup = true;
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    res.json({ success: true, token: jwtToken, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying TOTP setup', error: err.message });
  }
});

// POST /api/auth/login-totp - standard 6-digit OTP login
router.post('/login-totp', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: '6-digit OTP is required' });

    const user = await getOwner();
    if (!user.isTotpSetup || !user.totpSecret) {
      return res.status(400).json({ message: 'TOTP is not configured. Please initialize setup.' });
    }

    const cleanToken = String(token).trim().replace(/\s+/g, '');

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: cleanToken,
      window: 6, // Allow 3 minutes time drift
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Ensure your device clock is synced.' });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    res.json({ success: true, token: jwtToken, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Authentication error', error: err.message });
  }
});

// POST /api/auth/reset - emergency reset TOTP setup
router.post('/reset', async (req, res) => {
  try {
    const user = await getOwner();
    user.totpSecret = null;
    user.tempTotpSecret = null;
    user.isTotpSetup = false;
    await user.save();
    res.json({ success: true, message: 'TOTP 2FA reset successfully. Please set up a new authenticator key.' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting auth', error: err.message });
  }
});

// GET /api/auth/verify - check stored token validity
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
