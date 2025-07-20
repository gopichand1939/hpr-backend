const db = require("../models/db");

exports.getMission = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM mission_statement LIMIT 1");
    res.json({ data: rows[0] });
  } catch (err) {
    console.error("Fetch mission failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMission = async (req, res) => {
  const { heading, description } = req.body;

  try {
    await db.execute(
      "UPDATE mission_statement SET heading = ?, description = ? WHERE id = 1",
      [heading, description]
    );
    res.json({ message: "Mission updated successfully" });
  } catch (err) {
    console.error("Update mission failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
