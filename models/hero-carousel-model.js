const db = require('./db');

// [LOG] Hero Carousel Model Loaded
console.log('[MODEL] hero-carousel-model.js loaded');

// ================================
// Get all carousel slides
// ================================
const getAllSlides = async () => {
  console.log('[MODEL] getAllSlides called');

  const [rows] = await db.execute('SELECT * FROM hero_carousel ORDER BY id DESC');
  console.log('[MODEL] Slides fetched successfully');
  return rows;
};

// ================================
// Add new slide
// ================================
const addSlide = async (data) => {
  console.log('[MODEL] addSlide called with:', data);

  const [result] = await db.execute(
    'INSERT INTO hero_carousel (image, heading, subheading) VALUES (?, ?, ?)',
    [data.image, data.heading, data.subheading]
  );

  console.log('[MODEL] Slide added with ID:', result.insertId);
  return result;
};

// ================================
// Update slide
// ================================
const updateSlide = async (id, data) => {
  console.log(`[MODEL] updateSlide called for ID ${id} with:`, data);

  const [result] = await db.execute(
    'UPDATE hero_carousel SET image = ?, heading = ?, subheading = ? WHERE id = ?',
    [data.image, data.heading, data.subheading, id]
  );

  console.log(`[MODEL] Slide updated for ID ${id}`);
  return result;
};

// ================================
// Delete slide
// ================================
const deleteSlide = async (id) => {
  console.log(`[MODEL] deleteSlide called for ID ${id}`);

  const [result] = await db.execute(
    'DELETE FROM hero_carousel WHERE id = ?',
    [id]
  );

  console.log(`[MODEL] Slide deleted for ID ${id}`);
  return result;
};

module.exports = {
  getAllSlides,
  addSlide,
  updateSlide,
  deleteSlide,
};
