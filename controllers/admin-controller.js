const adminModel = require('../models/admin-model');
const { sendOtpEmail } = require('../utils/email');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// TEMP in-memory cache for pending OTP verifications
const tempAdmins = new Map(); // key: email, value: admin data with otp

// -----------------------------
// Register Admin (Step 1 of flow)
// -----------------------------
const registerAdmin = async (req, res) => {
  console.log('[CONTROLLER] registerAdmin called');
  try {
    const { name, email, password, contact, role } = req.body;
    console.log('[CONTROLLER] Received registration:', req.body);

    const existingAdmin = await adminModel.getAdminByEmail(email);
    if (existingAdmin && existingAdmin.is_verified === 1) {
      console.warn('[CONTROLLER] Email already verified:', email);
      return res.status(400).json({ message: 'Email already registered and verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('[CONTROLLER] Generated OTP:', otp);

    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      console.warn('[EMAIL] Failed to send OTP to:', email);
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

    const profileImageBuffer = req.file ? req.file.buffer : null;

    tempAdmins.set(email, {
      name,
      email,
      password,
      contact,
      role: role || 'admin',
      otp,
      profile_image: profileImageBuffer,
      status: 'pending',
      is_verified: 0,
    });

    console.log('[TEMP] Admin data cached for verification:', tempAdmins.get(email));
    return res.status(201).json({
      message: 'OTP sent to email. Please verify to complete registration.',
    });
  } catch (err) {
    console.error('[CONTROLLER] registerAdmin error:', err);
    res.status(500).json({
      message: 'Server error during registration',
      error: err.message,
    });
  }
};

// -----------------------------
// Verify OTP (Step 2 of flow)
// -----------------------------
const approveOtp = async (req, res) => {
  console.log('[CONTROLLER] approveOtp called');
  try {
    const { email, otp } = req.body;
    console.log('[CONTROLLER] OTP approval for:', email, 'OTP:', otp);

    if (!tempAdmins.has(email)) {
      console.warn('[CONTROLLER] No OTP request found for:', email);
      return res.status(404).json({ message: 'No OTP request found for this email' });
    }

    const cachedAdmin = tempAdmins.get(email);

    if (cachedAdmin.otp !== otp) {
      console.warn('[CONTROLLER] Invalid OTP for email:', email);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const finalData = {
      ...cachedAdmin,
      is_verified: 1,
      status: 'approved',
      otp: ''
    };

    const result = await adminModel.registerAdmin(finalData);
    console.log('[CONTROLLER] Admin inserted into DB:', result);

    tempAdmins.delete(email);

    return res.status(200).json({
      message: 'Admin verified and registered successfully',
    });
  } catch (err) {
    console.error('[CONTROLLER] approveOtp error:', err);
    res.status(500).json({
      message: 'Server error during OTP approval',
      error: err.message,
    });
  }
};

// -----------------------------
// Admin Login
// -----------------------------
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log('[LOGIN] Request received:', email, password);

  try {
    const user = await adminModel.getAdminByEmail(email);
    console.log('[LOGIN] DB result:', user);

    if (!user) {
      console.log('[LOGIN] No user found');
      return res.status(401).json({ success: false, message: 'Invalid email' });
    }

    if (user.password !== password) {
      console.log('[LOGIN] Password mismatch');
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('[LOGIN] Login successful, token generated');

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });

  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};



// ✅ Final Export
module.exports = {
  registerAdmin,
  approveOtp,
  loginAdmin
};
