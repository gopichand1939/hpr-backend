const {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
} = require('../models/projects-model');

console.log('[CONTROLLER] projects-controller.js loaded');

const fetchProjects = async (req, res) => {
  try {
    console.log('[CONTROLLER] fetchProjects() called');
    const rawProjects = await getAllProjects();

    const projects = rawProjects.map((project) => {
      return {
        ...project,
        image: project.image ? Buffer.from(project.image).toString('base64') : '',
      };
    });

    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    console.error('[CONTROLLER] Failed to fetch projects:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
};






const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file?.buffer;

    if (!title || !description || !image) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const project = { title, description, image };
    await addProject(project);

    res.status(201).json({ success: true, message: 'Project created successfully' });
  } catch (err) {
    console.error('[CONTROLLER] Failed to create project:', err);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

const editProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description } = req.body;
    const image = req.file ? req.file.buffer : null;

    const project = { title, description, image };
    await updateProject(projectId, project);

    res.status(200).json({ success: true, message: 'Project updated successfully' });
  } catch (err) {
    console.error('[CONTROLLER] Failed to update project:', err);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

const removeProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    await deleteProject(projectId);

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER] Failed to delete project:', err);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

module.exports = {
  fetchProjects,
  createProject,
  editProject,
  removeProject,
};
