const mysql = require('mysql2/promise'); // ✅ Use promise version
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test DB connection immediately when server starts
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('[DB] MySQL connected successfully.');
    connection.release(); // Release the connection back to pool
  } catch (err) {
    console.error('❌ [DB] MySQL connection failed:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
})();

module.exports = pool; // Export the pool for async/await use
