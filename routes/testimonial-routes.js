const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonial-controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getAllTestimonials);
router.post('/', upload.single('image'), createTestimonial);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
