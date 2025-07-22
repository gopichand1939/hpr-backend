const fs = require("fs");
const AboutUsModel = require("../models/about-us-model");

exports.getAboutUs = async (req, res) => {
  try {
    const data = await AboutUsModel.getAll();
    const mapped = data.map((item) => ({
      id: item.id,
      heading: item.heading,
      description: item.description,
      image: item.image_blob
        ? `data:image/jpeg;base64,${item.image_blob.toString("base64")}`
        : null,
    }));
    res.json(mapped);
  } catch (err) {
    console.error("GET About Us Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createAboutUs = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null; // ✅ Compatible with memoryStorage

    console.log('[CREATE] heading:', heading);
    console.log('[CREATE] description:', description);
    console.log('[CREATE] file received:', !!req.file); // true if file uploaded

    if (!heading || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const id = await AboutUsModel.create(heading, description, imageBuffer);

    res.status(201).json({ id, heading, description });
  } catch (err) {
    console.error("CREATE About Us Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



exports.updateAboutUs = async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, description } = req.body;
const imageBuffer = req.file ? req.file.buffer : null;
    await AboutUsModel.update(id, heading, description, imageBuffer);
    if (req.file) fs.unlinkSync(req.file.path);
    res.json({ id, heading, description });
  } catch (err) {
    console.error("UPDATE About Us Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteAboutUs = async (req, res) => {
  try {
    const { id } = req.params;
    await AboutUsModel.delete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE About Us Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
