const express = require("express");
const router = express.Router();
const footerController = require("../controllers/footer-controller");
const upload = require("../middlewares/upload-middleware");

// ✅ USE upload.single("logo") for PUT also
router.get("/", footerController.getFooter);
router.post("/", upload.single("logo"), footerController.createFooter);
router.put("/:id", upload.single("logo"), footerController.updateFooter); // ✅ FIXED!
router.delete("/:id", footerController.deleteFooter);

module.exports = router;
