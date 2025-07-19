// admin-model.js

const db = require('./db');

// Save a verified admin into the DB (after OTP approval)
const registerAdmin = async (adminData) => {
  console.log('[MODEL] Starting registerAdmin...');
  const {
    name,
    email,
    password,
    contact,
    role,
    profile_image,
    status,
    is_verified,
  } = adminData;

  const query = `
    INSERT INTO admin_users
    (name, email, password, contact, role, profile_image, status, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    email,
    password,
    contact,
    role || 'admin',
    profile_image || '',
    status || 'approved',
    is_verified || 1,
  ];

  console.log('[MODEL] Executing query:', query);
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('[MODEL] Error in registerAdmin:', err);
        return reject(err);
      }
      console.log('[MODEL] registerAdmin successful:', result);
      resolve(result);
    });
  });
};

// Get admin by email
const getAdminByEmail = (email) => {
  console.log('[MODEL] Starting getAdminByEmail with email:', email);
  const query = `SELECT * FROM admin_users WHERE email = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('[MODEL] Error in getAdminByEmail:', err);
        return reject(err);
      }
      console.log('[MODEL] getAdminByEmail results:', results);
      resolve(results[0]);
    });
  });
};

// Mark admin as verified (if needed in future for pre-inserted entries)
const approveOtp = (email, otp) => {
  console.log('[MODEL] Starting approveOtp for email:', email);
  const query = `
    UPDATE admin_users 
    SET status = 'approved', is_verified = 1, otp = ''
    WHERE email = ? AND otp = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [email, otp], (err, result) => {
      if (err) {
        console.error('[MODEL] Error in approveOtp:', err);
        return reject(err);
      }
      console.log('[MODEL] OTP approved and user verified:', result);
      resolve(result);
    });
  });
};

// Optional: If you ever want to support resending OTP for unverified admins (NOT used with temp memory flow)
const updateOtp = (email, otp) => {
  console.log('[MODEL] Updating OTP for unverified admin:', email);
  const query = `UPDATE admin_users SET otp = ? WHERE email = ? AND is_verified = 0`;

  return new Promise((resolve, reject) => {
    db.query(query, [otp, email], (err, result) => {
      if (err) {
        console.error('[MODEL] Error in updateOtp:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  registerAdmin,
  getAdminByEmail,
  approveOtp,
  updateOtp,
};
