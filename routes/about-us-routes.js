const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload-middleware");
const {
  getAboutUs,
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
} = require("../controllers/about-us-controller");

router.get("/about-us", getAboutUs);
router.post("/about-us", upload.single("image"), createAboutUs);
router.put("/about-us/:id", upload.single("image"), updateAboutUs);
router.delete("/about-us/:id", deleteAboutUs);

module.exports = router;
