const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Your OTP Code for HPR Infra Admin Approval',
      html: `<p>Your OTP code is: <b>${otp}</b></p><p>This code will expire in 10 minutes.</p>`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] OTP sent:', info.response);
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending OTP:', error);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
};
