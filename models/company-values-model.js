const db = require('../config/db');

const getAllValues = async () => {
  const [rows] = await db.query('SELECT * FROM home_company_values ORDER BY id DESC');
  return rows;
};

const addValue = async ({ title, description, image }) => {
  const [result] = await db.query(
    'INSERT INTO home_company_values (title, description, image) VALUES (?, ?, ?)',
    [title, description, image]
  );
  return result;
};

const updateValue = async (id, { title, description, image }) => {
  let query, params;
  if (image) {
    query = 'UPDATE home_company_values SET title = ?, description = ?, image = ? WHERE id = ?';
    params = [title, description, image, id];
  } else {
    query = 'UPDATE home_company_values SET title = ?, description = ? WHERE id = ?';
    params = [title, description, id];
  }
  const [result] = await db.query(query, params);
  return result;
};

const deleteValue = async (id) => {
  const [result] = await db.query('DELETE FROM home_company_values WHERE id = ?', [id]);
  return result;
};

module.exports = {
  getAllValues,
  addValue,
  updateValue,
  deleteValue
};
