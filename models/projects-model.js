const db = require('../config/db'); // ✅ Correct path
console.log('[MODEL] projects-model.js loaded');

// ================================
// Get all projects
// ================================
const getAllProjects = async () => {
  console.log('[MODEL] getAllProjects called');
  const [results] = await db.query('SELECT * FROM home_projects ORDER BY id DESC');
  console.log('[MODEL] Projects fetched successfully');
  return results;
};

// ================================
// Add new project
// ================================
const addProject = async (project) => {
  console.log('[MODEL] addProject called');
  const { title, description, image } = project;
  const query = `INSERT INTO home_projects (title, description, image) VALUES (?, ?, ?)`;
  const [result] = await db.query(query, [title, description, image]);
  console.log('[MODEL] Project inserted');
  return result;
};

// ================================
// Update existing project
// ================================
const updateProject = async (id, project) => {
  console.log('[MODEL] updateProject called');
  const { title, description, image } = project;

  let query, params;

  if (image) {
    query = `UPDATE home_projects SET title = ?, description = ?, image = ? WHERE id = ?`;
    params = [title, description, image, id];
  } else {
    query = `UPDATE home_projects SET title = ?, description = ? WHERE id = ?`;
    params = [title, description, id];
  }

  const [result] = await db.query(query, params);
  console.log('[MODEL] Project updated');
  return result;
};

// ================================
// Delete project
// ================================
const deleteProject = async (id) => {
  console.log('[MODEL] deleteProject called');
  const query = `DELETE FROM home_projects WHERE id = ?`;
  const [result] = await db.query(query, [id]);
  console.log('[MODEL] Project deleted');
  return result;
};

module.exports = {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
};
