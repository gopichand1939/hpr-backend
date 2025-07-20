const testimonialModel = require('../models/testimonial-model');

const getAllTestimonials = async (req, res) => {
  try {
    const data = await testimonialModel.getAll();
    const base64Data = data.map(item => ({
      ...item,
      image: item.image?.toString('base64')
    }));
    res.json({ success: true, data: base64Data });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body;
    const imageBuffer = req.file?.buffer || null;
    await testimonialModel.create(name, message, imageBuffer);
    res.json({ success: true, message: 'Testimonial added successfully' });
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ success: false, message: 'Creation failed' });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body;
    const { id } = req.params;
    const imageBuffer = req.file?.buffer || null;
    await testimonialModel.update(id, name, message, imageBuffer);
    res.json({ success: true, message: 'Testimonial updated successfully' });
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await testimonialModel.delete(id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
