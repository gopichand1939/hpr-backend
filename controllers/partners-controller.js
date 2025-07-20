const partnersModel = require('../models/partners-model');

// Get all partners
const getAllPartners = async (req, res) => {
  console.log('[CONTROLLER] getAllPartners called');
  try {
    const rows = await partnersModel.getAll();
    res.json(rows);
  } catch (error) {
    console.error('[CONTROLLER] Error fetching partners:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new partner
const createPartner = async (req, res) => {
  console.log('[CONTROLLER] Creating new partner:', req.body.name);
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    await partnersModel.create({ name, description });
    res.status(201).json({ message: 'Partner created successfully' });
  } catch (error) {
    console.error('[CONTROLLER] Error creating partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update partner
const updatePartner = async (req, res) => {
  console.log('[CONTROLLER] Updating partner:', req.params.id);
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    await partnersModel.update(id, { name, description });
    res.json({ message: 'Partner updated successfully' });
  } catch (error) {
    console.error('[CONTROLLER] Error updating partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete partner
const deletePartner = async (req, res) => {
  console.log('[CONTROLLER] Deleting partner:', req.params.id);
  try {
    const { id } = req.params;
    await partnersModel.delete(id);
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('[CONTROLLER] Error deleting partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner
};
