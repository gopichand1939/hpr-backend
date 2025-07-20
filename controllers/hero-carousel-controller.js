const {
  getAllSlides,
  addSlide,
  updateSlide,
  deleteSlide,
} = require('../models/hero-carousel-model');

// [LOG] Hero Carousel Controller loaded
console.log('[CONTROLLER] hero-carousel-controller.js loaded');

// ===============================
// Get All Slides
// ===============================
const fetchHeroSlides = async (req, res) => {
  console.log('[CONTROLLER] fetchHeroSlides() called');

  try {
    const results = await getAllSlides();
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.error('[CONTROLLER] Error fetching hero slides:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch slides' });
  }
};

// ===============================
// Add New Slide
// ===============================
const createHeroSlide = async (req, res) => {
  console.log('[CONTROLLER] createHeroSlide() called');
  console.log('[DEBUG] req.body:', req.body);
  console.log('[DEBUG] req.file:', req.file);

  const { heading, subheading } = req.body;
  const imageFile = req.file;

  if (!heading || !subheading || !imageFile) {
    console.warn('[CONTROLLER] Missing fields in request body');
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const newSlide = {
    heading,
    subheading,
    image: imageFile.buffer,
  };

  try {
    await addSlide(newSlide);
    res.status(201).json({ success: true, message: 'Slide added successfully' });
  } catch (err) {
    console.error('[CONTROLLER] Failed to add slide:', err);
    res.status(500).json({ success: false, message: 'Slide creation failed' });
  }
};

// ===============================
// Update Slide
// ===============================
const updateHeroSlide = async (req, res) => {
  console.log('[CONTROLLER] updateHeroSlide() called');

  const slideId = req.params.id;
  const { heading, subheading } = req.body;
  const imageFile = req.file;

  if (!heading || !subheading) {
    console.warn('[CONTROLLER] Missing fields for update');
    return res.status(400).json({ success: false, message: 'Heading and Subheading are required' });
  }

  const updatedData = {
    heading,
    subheading,
    image: imageFile ? imageFile.buffer : req.body.oldImage,
  };

  try {
    await updateSlide(slideId, updatedData);
    res.status(200).json({ success: true, message: 'Slide updated successfully' });
  } catch (err) {
    console.error('[CONTROLLER] Failed to update slide:', err);
    res.status(500).json({ success: false, message: 'Slide update failed' });
  }
};

// ===============================
// Delete Slide
// ===============================
const deleteHeroSlide = async (req, res) => {
  console.log('[CONTROLLER] deleteHeroSlide() called');

  const slideId = req.params.id;

  try {
    await deleteSlide(slideId);
    res.status(200).json({ success: true, message: 'Slide deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER] Error deleting slide:', err);
    res.status(500).json({ success: false, message: 'Failed to delete slide' });
  }
};

module.exports = {
  fetchHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
