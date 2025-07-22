const FooterModel = require("../models/footer-model");
const fs = require("fs");
const path = require("path");
console.log("[CONTROLLER] footer-controller.js loaded");

exports.getFooter = async (req, res) => {
  try {
    console.log("[CONTROLLER] getFooter called");

    const data = await FooterModel.getLatest(); // ✅ Get latest footer

    if (Array.isArray(data) && data.length > 0 && data[0].logo) {
      // ✅ Convert BLOB buffer to base64 directly
      data[0].logo = Buffer.from(data[0].logo).toString("base64");
    }

    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("GET footer error", error);
    res.status(500).json({ success: false, message: "Error getting footer" });
  }
};


exports.createFooter = async (req, res) => {
  try {
    console.log("[CONTROLLER] createFooter called");

    const logo = req.file ? req.file.buffer : null;
    const originalName = req.file ? req.file.originalname : null;

    const data = {
      ...req.body,
      logo,
      logo_filename: originalName // ⬅️ save if needed
    };

    await FooterModel.create(data);
    res.json({ success: true, message: "Footer created" });
  } catch (error) {
    console.error("CREATE footer error", error);
    res.status(500).json({ success: false, message: "Error creating footer" });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    console.log("[CONTROLLER] updateFooter called");

    const id = req.params.id;
    const logo = req.file ? req.file.buffer : req.body.existingLogo;
    const originalName = req.file ? req.file.originalname : req.body.existingLogoFilename;

    const data = {
      ...req.body,
      id,
      logo,
      logo_filename: originalName // ⬅️ if updating filename
    };

    await FooterModel.update(data);
    res.json({ success: true, message: "Footer updated" });
  } catch (error) {
    console.error("UPDATE footer error", error);
    res.status(500).json({ success: false, message: "Error updating footer" });
  }
};



exports.deleteFooter = async (req, res) => {
  try {
    console.log("[CONTROLLER] deleteFooter called");

    const id = req.params.id;
    await FooterModel.delete(id);

    res.json({ success: true, message: "Footer deleted" });
  } catch (error) {
    console.error("DELETE footer error", error);
    res.status(500).json({ success: false, message: "Error deleting footer" });
  }
};
