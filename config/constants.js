module.exports = {
  USER_ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    PENDING: 'pending',
  },

  OTP_EXPIRY_MINUTES: 10,

  JWT_SECRET: 'hpr_super_admin_secret_key', // ⚠️ Replace with strong secret in production
  JWT_EXPIRES_IN: '1h',

  EMAIL_SETTINGS: {
    FROM_NAME: 'HPR Infra',
    FROM_EMAIL: 'no-reply@hprinfra.com',
  },

  DEFAULT_PROFILE_IMAGE: '/uploads/default-avatar.png',
};
