const multer = require('multer');
const storage = multer.memoryStorage(); // stores image as buffer (Blob)
const upload = multer({ storage: storage });

module.exports = upload;
