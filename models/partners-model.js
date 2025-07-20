const db = require('../config/db');

console.log('[MODEL] partners-model.js loaded');

const partnersModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM partners');
    return rows;
  },

  create: async ({ name, description }) => {
    const [result] = await db.query(
      'INSERT INTO partners (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.insertId;
  },

  update: async (id, { name, description }) => {
    await db.query(
      'UPDATE partners SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM partners WHERE id = ?', [id]);
  }
};

module.exports = partnersModel;
