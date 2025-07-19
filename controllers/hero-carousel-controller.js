const path = require('path');
const fs = require('fs');
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
const fetchHeroSlides = (req, res) => {
  console.log('[CONTROLLER] fetchHeroSlides() called');

  getAllSlides((err, results) => {
    if (err) {
      console.error('[CONTROLLER] Error fetching hero slides:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch slides' });
    }

    console.log('[CONTROLLER] Slides fetched successfully');
    res.status(200).json({ success: true, data: results });
  });
};

// ===============================
// Add New Slide
// ===============================
const createHeroSlide = (req, res) => {
  console.log('[CONTROLLER] createHeroSlide() called');

  const { heading, subheading } = req.body;
  const imageFile = req.file;

  if (!heading || !subheading || !imageFile) {
    console.warn('[CONTROLLER] Missing fields in request body');
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const newSlide = {
    heading,
    subheading,
    image: `/uploads/${imageFile.filename}`,
  };

  addSlide(newSlide, (err, result) => {
    if (err) {
      console.error('[CONTROLLER] Failed to add slide:', err);
      return res.status(500).json({ success: false, message: 'Slide creation failed' });
    }

    console.log('[CONTROLLER] Slide created successfully');
    res.status(201).json({ success: true, message: 'Slide added successfully' });
  });
};

// ===============================
// Update Slide
// ===============================
const updateHeroSlide = (req, res) => {
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
    image: imageFile ? `/uploads/${imageFile.filename}` : req.body.oldImage, // fallback to old image
  };

  updateSlide(slideId, updatedData, (err, result) => {
    if (err) {
      console.error('[CONTROLLER] Failed to update slide:', err);
      return res.status(500).json({ success: false, message: 'Slide update failed' });
    }

    console.log(`[CONTROLLER] Slide with ID ${slideId} updated`);
    res.status(200).json({ success: true, message: 'Slide updated successfully' });
  });
};

// ===============================
// Delete Slide
// ===============================
const deleteHeroSlide = (req, res) => {
  console.log('[CONTROLLER] deleteHeroSlide() called');

  const slideId = req.params.id;

  deleteSlide(slideId, (err, result) => {
    if (err) {
      console.error('[CONTROLLER] Error deleting slide:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete slide' });
    }

    console.log(`[CONTROLLER] Slide with ID ${slideId} deleted`);
    res.status(200).json({ success: true, message: 'Slide deleted successfully' });
  });
};

module.exports = {
  fetchHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
