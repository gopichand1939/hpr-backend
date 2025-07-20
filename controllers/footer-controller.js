const FooterModel = require("../models/footer-model");
const fs = require("fs");
const path = require("path");
console.log("[CONTROLLER] footer-controller.js loaded");

exports.getFooter = async (req, res) => {
  try {
    console.log("[CONTROLLER] getFooter called");

    const data = await FooterModel.getAll(); // returns an array

    if (Array.isArray(data) && data.length > 0 && data[0].logo) {
      const logoPath = path.join(__dirname, "..", "uploads", data[0].logo);
      data[0].logo = fs.existsSync(logoPath)
        ? fs.readFileSync(logoPath).toString("base64")
        : null;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("GET footer error", error);
    res.status(500).json({ success: false, message: "Error getting footer" });
  }
};

exports.createFooter = async (req, res) => {
  try {
    console.log("[CONTROLLER] createFooter called");

    const logo = req.file ? req.file.filename : null;
    const data = { ...req.body, logo };

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

    const logo = req.file ? req.file.filename : req.body.existingLogo;
    const data = { ...req.body, logo };

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
