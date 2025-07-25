const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const missionRoutes = require("./routes/mission-statement-routes");
const projectRoutes = require('./routes/projects-routes');
const companyValuesRoutes = require('./routes/company-values-routes');
const testimonialRoutes = require('./routes/testimonial-routes');
const footerRoutes = require("./routes/footer-routes");
const aboutUsRoutes = require("./routes/about-us-routes");
const aboutUsSubsectionRoutes = require("./routes/about-us-subsection-routes");
const partnersRoutes = require('./routes/partners-routes');
const hprProjectsRoutes = require('./routes/hpr-projects-routes');
const newsRoutes = require('./routes/news-routes'); // ✅ Add this line

// Load environment variables
console.log('[INIT] Loading environment variables...');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('[INIT] Applying global middlewares...');
// app.use(cors());

// app.use(cors({
//   origin: "http://localhost:5173",   // frontend domain
//   credentials: true                  // allow cookies/tokens
// }));


// below is the abve replce 

const allowedOrigins = [
  "http://localhost:5173",
  /\.vercel\.app$/ // Allow all *.vercel.app URLs
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));




app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }));

app.use('/api/v1/home/projects', projectRoutes);

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
app.use("/api/v1/mission", missionRoutes);
app.use('/api/v1/home/company-values', companyValuesRoutes);
app.use('/api/v1/home/testimonials', testimonialRoutes);
app.use("/api/v1/home/footer", footerRoutes);
app.use("/api/v1", aboutUsRoutes);
app.use("/api/v1", aboutUsSubsectionRoutes);
app.use('/api/v1/partners', partnersRoutes);
app.use('/api/v1', hprProjectsRoutes);
app.use('/api/v1/news', newsRoutes); // ✅ Add this line

// Default route
app.get('/', (req, res) => {
  console.log('[ROUTE] Root / accessed');
  res.send('HPR Infra backend is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`[SERVER] Server started at http://localhost:${PORT}`);
});
