const fs = require("fs");
const AboutUsSubsectionModel = require("../models/about-us-subsection-model");

exports.getSubsections = async (req, res) => {
  try {
    const data = await AboutUsSubsectionModel.getAll();
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
    console.error("GET Subsections Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createSubsection = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const imageBuffer = req.file ? fs.readFileSync(req.file.path) : null;
    const id = await AboutUsSubsectionModel.create(heading, description, imageBuffer);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(201).json({ id, heading, description });
  } catch (err) {
    console.error("CREATE Subsection Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateSubsection = async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, description } = req.body;
    const imageBuffer = req.file ? fs.readFileSync(req.file.path) : null;
    await AboutUsSubsectionModel.update(id, heading, description, imageBuffer);
    if (req.file) fs.unlinkSync(req.file.path);
    res.json({ id, heading, description });
  } catch (err) {
    console.error("UPDATE Subsection Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteSubsection = async (req, res) => {
  try {
    const { id } = req.params;
    await AboutUsSubsectionModel.delete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE Subsection Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
