const express = require('express');
const router = express.Router();

// Controller
const {
  fetchHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} = require('../controllers/hero-carousel-controller');

// [LOG] Hero Carousel Routes Loaded
console.log('[ROUTES] hero-carousel-routes.js loaded');

// ====================================
// Setup Multer Storage for Uploads
// ====================================
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


// ====================================
// Routes
// ====================================

// @GET    /api/hero-carousel
// @desc   Get all hero slides
router.get('/', (req, res) => {
  console.log('[ROUTE] GET /api/hero-carousel called');
  fetchHeroSlides(req, res);
});

// @POST   /api/hero-carousel
// @desc   Add new slide
router.post('/', upload.single('image'), (req, res) => {
console.log('[ROUTE] POST /api/v1/hero-carousel called');
  createHeroSlide(req, res);
});

// @PUT    /api/hero-carousel/:id
// @desc   Update slide
router.put('/:id', upload.single('image'), (req, res) => {
  console.log('[ROUTE] PUT /api/hero-carousel/:id called');
  updateHeroSlide(req, res);
});

// @DELETE /api/hero-carousel/:id
// @desc   Delete slide
router.delete('/:id', (req, res) => {
  console.log('[ROUTE] DELETE /api/hero-carousel/:id called');
  deleteHeroSlide(req, res);
});

module.exports = router;
