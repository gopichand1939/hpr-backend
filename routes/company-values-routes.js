const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload-middleware');
const {
  fetchValues,
  createValue,
  editValue,
  removeValue
} = require('../controllers/company-values-controller');

router.get('/', fetchValues);
router.post('/', upload.single('image'), createValue);
router.put('/:id', upload.single('image'), editValue);
router.delete('/:id', removeValue);

module.exports = router;
