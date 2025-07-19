const db = require('./db');

// [LOG] Hero Carousel Model Loaded
console.log('[MODEL] hero-carousel-model.js loaded');

// ================================
// Get all carousel slides
// ================================
const getAllSlides = (callback) => {
  console.log('[MODEL] getAllSlides called');

  const query = 'SELECT * FROM hero_carousel ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('[MODEL] Error fetching slides:', err);
      return callback(err, null);
    }

    console.log('[MODEL] Slides fetched successfully');
    callback(null, results);
  });
};

// ================================
// Add new slide
// ================================
const addSlide = (data, callback) => {
  console.log('[MODEL] addSlide called with:', data);

  const query = 'INSERT INTO hero_carousel (image, heading, subheading) VALUES (?, ?, ?)';
  db.query(query, [data.image, data.heading, data.subheading], (err, result) => {
    if (err) {
      console.error('[MODEL] Error adding slide:', err);
      return callback(err, null);
    }

    console.log('[MODEL] Slide added with ID:', result.insertId);
    callback(null, result);
  });
};

// ================================
// Update slide
// ================================
const updateSlide = (id, data, callback) => {
  console.log(`[MODEL] updateSlide called for ID ${id} with:`, data);

  const query = 'UPDATE hero_carousel SET image = ?, heading = ?, subheading = ? WHERE id = ?';
  db.query(query, [data.image, data.heading, data.subheading, id], (err, result) => {
    if (err) {
      console.error('[MODEL] Error updating slide:', err);
      return callback(err, null);
    }

    console.log(`[MODEL] Slide updated for ID ${id}`);
    callback(null, result);
  });
};

// ================================
// Delete slide
// ================================
const deleteSlide = (id, callback) => {
  console.log(`[MODEL] deleteSlide called for ID ${id}`);

  const query = 'DELETE FROM hero_carousel WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('[MODEL] Error deleting slide:', err);
      return callback(err, null);
    }

    console.log(`[MODEL] Slide deleted for ID ${id}`);
    callback(null, result);
  });
};

module.exports = {
  getAllSlides,
  addSlide,
  updateSlide,
  deleteSlide,
};
