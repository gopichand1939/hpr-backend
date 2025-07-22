const db = require('../config/db');

const testimonialModel = {
  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM home_testimonials');
    return rows;
  },

  create: async (name, message, imageBuffer) => {
    const [result] = await db.execute(
      'INSERT INTO home_testimonials (name, message, image) VALUES (?, ?, ?)',
      [name, message, imageBuffer]
    );
    return result;
  },

  update: async (id, name, message, imageBuffer) => {
    if (imageBuffer) {
      return db.execute(
        'UPDATE home_testimonials SET name = ?, message = ?, image = ? WHERE id = ?',
        [name, message, imageBuffer, id]
      );
    }
    return db.execute(
      'UPDATE home_testimonials SET name = ?, message = ? WHERE id = ?',
      [name, message, id]
    );
  },

  delete: async (id) => {
    return db.execute('DELETE FROM home_testimonials WHERE id = ?', [id]);
  }
};

module.exports = testimonialModel;
