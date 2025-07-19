// admin-controller.js

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
  const {
  name,
  email,
  password,
  contact,
  role,
} = req.body;



    console.log('[CONTROLLER] Received registration:', req.body);

    // Check if already in DB and verified
    const existingAdmin = await adminModel.getAdminByEmail(email);
    if (existingAdmin && existingAdmin.is_verified === 1) {
      console.warn('[CONTROLLER] Email already verified:', email);
      return res.status(400).json({ message: 'Email already registered and verified' });
    }

    // Always generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('[CONTROLLER] Generated OTP:', otp);

    // Send OTP email
    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      console.warn('[EMAIL] Failed to send OTP to:', email);
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

    // 🔁 Convert profile_image base64 string to Buffer for BLOB support
const profileImageBuffer = req.file ? req.file.buffer : null; // This reads the file as buffer

    // Store in-memory until OTP is verified
    tempAdmins.set(email, {
      name,
      email,
      password,
      contact,
      role: role || 'admin',
      otp,
      profile_image: profileImageBuffer, // Stored as binary buffer
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

    // Check if OTP is pending for this email
    if (!tempAdmins.has(email)) {
      console.warn('[CONTROLLER] No OTP request found for:', email);
      return res.status(404).json({ message: 'No OTP request found for this email' });
    }

    const cachedAdmin = tempAdmins.get(email);

    // Check OTP match
    if (cachedAdmin.otp !== otp) {
      console.warn('[CONTROLLER] Invalid OTP for email:', email);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Prepare and insert into DB
    const finalData = {
      ...cachedAdmin,
      is_verified: 1,
      status: 'approved',
      otp: ''
    };

    const result = await adminModel.registerAdmin(finalData);
    console.log('[CONTROLLER] Admin inserted into DB:', result);

    // Clean up temp storage
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
  try {
    const { email, password } = req.body;

    const admin = await adminModel.getAdminByEmail(email);
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!admin.is_verified) {
      return res.status(403).json({ message: 'Admin not verified' });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET, // 🔐 Store securely in .env
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        is_verified: admin.is_verified,
      },
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};




module.exports = {
  registerAdmin,
  approveOtp,
  loginAdmin
};
