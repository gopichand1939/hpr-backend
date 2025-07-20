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
    const imageBuffer = req.file ? fs.readFileSync(req.file.path) : null;
    const id = await AboutUsModel.create(heading, description, imageBuffer);
    if (req.file) fs.unlinkSync(req.file.path);
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
    const imageBuffer = req.file ? fs.readFileSync(req.file.path) : null;
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
