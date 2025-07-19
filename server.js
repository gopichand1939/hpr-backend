const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

// Load environment variables
console.log('[INIT] Loading environment variables...');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('[INIT] Applying global middlewares...');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('[INIT] Setting static folder for uploads...');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
console.log('[ROUTES] Importing route modules...');
const heroCarouselRoutes = require('./routes/hero-carousel-routes');
const adminRoutes = require('./routes/admin-routes');

// Attach Routes
console.log('[ROUTES] Attaching route middlewares...');
app.use('/api/v1/hero-carousel', heroCarouselRoutes);
app.use('/api/v1/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  console.log('[ROUTE] Root / accessed');
  res.send('HPR Infra backend is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`[SERVER] Server started at http://localhost:${PORT}`);
});
