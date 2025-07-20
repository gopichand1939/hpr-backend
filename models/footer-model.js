const db = require("../config/db");
console.log("[MODEL] footer-model.js loaded");

const FooterModel = {
  getAll: async () => {
    console.log("[MODEL] getAll called");
    const [rows] = await db.query("SELECT * FROM footer LIMIT 1");
    return rows; // ✅ return as array
  },

  create: async (data) => {
    console.log("[MODEL] create called with:", data);

    const {
      tagline = "",
      address = "",
      phone = "",
      email = "",
      facebook = "",
      instagram = "",
      linkedin = "",
      logo = null
    } = data;

    const [result] = await db.execute(
      `INSERT INTO footer 
       (tagline, address, phone, email, facebook, instagram, linkedin, logo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tagline, address, phone, email, facebook, instagram, linkedin, logo]
    );

    return result;
  },

  update: async (data) => {
    console.log("[MODEL] update called with:", data);

    const {
      id,
      tagline = "",
      address = "",
      phone = "",
      email = "",
      facebook = "",
      instagram = "",
      linkedin = "",
      logo = null
    } = data;

    const [result] = await db.execute(
      `UPDATE footer 
       SET tagline=?, address=?, phone=?, email=?, facebook=?, instagram=?, linkedin=?, logo=? 
       WHERE id=?`,
      [tagline, address, phone, email, facebook, instagram, linkedin, logo, id]
    );

    return result;
  },

  delete: async (id) => {
    console.log("[MODEL] delete called with id:", id);
    const [result] = await db.execute("DELETE FROM footer WHERE id=?", [id]);
    return result;
  }
};

module.exports = FooterModel;
