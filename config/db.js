// hpr-backend/config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // ✅ Add this line to increase the max packet size to 256MB
  maxAllowedPacket: 256 * 1024 * 1024,
});

module.exports = db;
