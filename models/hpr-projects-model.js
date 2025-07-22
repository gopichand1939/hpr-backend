const db = require("../config/db");

const HprProjectsModel = {
  // -------------------- PROJECTS MAIN --------------------
  createProject: async (name, category, shortDesc, logo, banner) => {
    const [result] = await db.execute(
      `INSERT INTO hpr_projects (name, category, short_desc, logo_blob, banner_blob) VALUES (?, ?, ?, ?, ?)`,
      [name, category, shortDesc, logo, banner]
    );
    return result.insertId;
  },

  getAllProjects: async () => {
    const [rows] = await db.execute(`SELECT * FROM hpr_projects ORDER BY id DESC`);
    return rows;
  },

  getProjectById: async (id) => {
    const [rows] = await db.execute(`SELECT * FROM hpr_projects WHERE id = ?`, [id]);
    return rows[0];
  },

  updateProject: async (id, name, category, shortDesc, logo, banner) => {
    return db.execute(
      `UPDATE hpr_projects SET name = ?, category = ?, short_desc = ?, logo_blob = ?, banner_blob = ? WHERE id = ?`,
      [name, category, shortDesc, logo, banner, id]
    );
  },

  deleteProject: async (id) => {
    return db.execute(`DELETE FROM hpr_projects WHERE id = ?`, [id]);
  },

  // -------------------- UTILITIES --------------------
  getProjectNames: async () => {
    const [rows] = await db.execute(`SELECT id, name FROM hpr_projects`);
    return rows;
  },

  getGalleryByCategory: async (category) => {
    const [rows] = await db.execute(
      `SELECT g.* FROM hpr_projects_gallery g JOIN hpr_projects p ON g.project_id = p.id WHERE p.category = ? ORDER BY g.work_date DESC`,
      [category]
    );
    return rows;
  },

  // -------------------- HOME --------------------
  createHome: async (projectId, title, description, brochure, image) => {
    const [result] = await db.execute(
      `INSERT INTO hpr_projects_home (project_id, title, description, brochure_blob, image_blob) VALUES (?, ?, ?, ?, ?)`,
      [projectId, title, description, brochure, image]
    );
    return result.insertId;
  },

  getHomeByProjectId: async (projectId) => {
    const [rows] = await db.execute(`SELECT * FROM hpr_projects_home WHERE project_id = ?`, [projectId]);
    return rows[0];
  },

  updateHome: async (id, title, description, brochure, image) => {
    return db.execute(
      `UPDATE hpr_projects_home SET title = ?, description = ?, brochure_blob = ?, image_blob = ? WHERE id = ?`,
      [title, description, brochure, image, id]
    );
  },

  deleteHome: async (id) => {
    return db.execute(`DELETE FROM hpr_projects_home WHERE id = ?`, [id]);
  },

// -------------------- GALLERY --------------------
addGalleryImage: async (projectId, workDate, description, image) => {
  console.log("⏺️ INSERTING GALLERY:");
  console.log("projectId:", projectId);
  console.log("workDate:", workDate);
  console.log("description:", description);
  console.log("image present:", !!image);

  return db.execute(
    `INSERT INTO hpr_projects_gallery (project_id, work_date, description, image_blob) VALUES (?, ?, ?, ?)`,
    [projectId, workDate, description, image || null] // ✅ Ensures no "undefined"
  );
},

getGalleryByProjectId: async (projectId) => {
  const [rows] = await db.execute(
    `SELECT * FROM hpr_projects_gallery WHERE project_id = ? ORDER BY work_date DESC`,
    [projectId]
  );
  return rows;
},

deleteGalleryImage: async (id) => {
  return db.execute(`DELETE FROM hpr_projects_gallery WHERE id = ?`, [id]);
},

  // ---// ----------------- PLAN --------------------
addPlan: async (projectId, description, plan) => {
  console.log("⏺️ INSERTING PLAN:");
  console.log("projectId:", projectId);
  console.log("description:", description);
  console.log("plan present:", !!plan);

  return db.execute(
    `INSERT INTO hpr_projects_plan (project_id, description, plan_blob) VALUES (?, ?, ?)`,
    [
      projectId || null,
      description || null,
      plan ?? null  // ✅ Prevent undefined binding error
    ]
  );
},

getPlanByProjectId: async (projectId) => {
  const [rows] = await db.execute(
    `SELECT * FROM hpr_projects_plan WHERE project_id = ?`,
    [projectId || null]
  );
  return rows[0];
},

updatePlan: async (id, description, plan) => {
  console.log("🔄 UPDATING PLAN:", { id, description, hasPlan: !!plan });

  return db.execute(
    `UPDATE hpr_projects_plan SET description = ?, plan_blob = ? WHERE id = ?`,
    [
      description || null,
      plan ?? null,  // ✅ prevent undefined
      id || null
    ]
  );
},

deletePlan: async (id) => {
  console.log("🗑️ Deleting PLAN ID:", id);
  return db.execute(`DELETE FROM hpr_projects_plan WHERE id = ?`, [id || null]);
},

  // -------------------- LOCATION --------------------
  addLocation: async (projectId, iframe) => {
    return db.execute(
      `INSERT INTO hpr_projects_location (project_id, iframe_link) VALUES (?, ?)`,
      [projectId, iframe]
    );
  },

  getLocationByProjectId: async (projectId) => {
    const [rows] = await db.execute(`SELECT * FROM hpr_projects_location WHERE project_id = ?`, [projectId]);
    return rows[0];
  },

  updateLocation: async (id, iframe) => {
    return db.execute(`UPDATE hpr_projects_location SET iframe_link = ? WHERE id = ?`, [iframe, id]);
  },

  deleteLocation: async (id) => {
    return db.execute(`DELETE FROM hpr_projects_location WHERE id = ?`, [id]);
  },

  // -------------------- AMENITIES --------------------
  addAmenities: async (projectId, infrastructure, features) => {
    return db.execute(
      `INSERT INTO hpr_projects_amenities (project_id, infrastructure, features) VALUES (?, ?, ?)`,
      [projectId, JSON.stringify(infrastructure), JSON.stringify(features)]
    );
  },

  getAmenitiesByProjectId: async (projectId) => {
    const [rows] = await db.execute(`SELECT * FROM hpr_projects_amenities WHERE project_id = ?`, [projectId]);
    return rows[0];
  },

  updateAmenities: async (id, infrastructure, features) => {
    return db.execute(
      `UPDATE hpr_projects_amenities SET infrastructure = ?, features = ? WHERE id = ?`,
      [JSON.stringify(infrastructure), JSON.stringify(features), id]
    );
  },

  deleteAmenities: async (id) => {
    return db.execute(`DELETE FROM hpr_projects_amenities WHERE id = ?`, [id]);
  },

  // -------------------- CONTACT FORM --------------------
  submitContactForm: async (name, email, phone, message, projectName) => {
    return db.execute(
      `INSERT INTO hpr_projects_contacts (name, email, phone, message, project_name) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, message, projectName]
    );
  },
};

module.exports = HprProjectsModel;
