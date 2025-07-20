const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload-middleware');
const {
  fetchProjects,
  createProject,
  editProject,
  removeProject
} = require('../controllers/projects-controller');

router.get('/', fetchProjects);
router.post('/', upload.single('image'), createProject);
router.put('/:id', upload.single('image'), editProject);
router.delete('/:id', removeProject);

module.exports = router;
