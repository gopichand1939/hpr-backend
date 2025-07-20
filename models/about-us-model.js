const db = require("../config/db");

const AboutUsModel = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM about_us");
    return rows;
  },

  create: async (heading, description, imageBlob) => {
    const [result] = await db.query(
      "INSERT INTO about_us (heading, description, image_blob) VALUES (?, ?, ?)",
      [heading, description, imageBlob]
    );
    return result.insertId;
  },

  update: async (id, heading, description, imageBlob) => {
    if (imageBlob) {
      return db.query(
        "UPDATE about_us SET heading = ?, description = ?, image_blob = ? WHERE id = ?",
        [heading, description, imageBlob, id]
      );
    } else {
      return db.query(
        "UPDATE about_us SET heading = ?, description = ? WHERE id = ?",
        [heading, description, id]
      );
    }
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM about_us WHERE id = ?", [id]);
    return result;
  },
};

module.exports = AboutUsModel;
