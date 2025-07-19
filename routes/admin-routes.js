const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const upload = require('../middlewares/upload-middleware'); // <-- multer middleware

console.log('[ROUTES] Admin routes loaded');

router.post('/register', upload.single('profile_image'), adminController.registerAdmin); // FIXED!
router.post('/verify-otp', adminController.approveOtp);
// Admin login
router.post('/login', (req, res) => {
  console.log('[ROUTES] POST /login');
  adminController.loginAdmin(req, res);
});



module.exports = router;
