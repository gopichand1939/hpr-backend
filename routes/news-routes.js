const express = require("express");
const router = express.Router();

const NewsController = require("../controllers/news-controller");
const upload = require("../middlewares/upload-middleware");

const uploadFields = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "banner", maxCount: 1 },
]);

// -------------------- NEWS CRUD --------------------
router.post("/", uploadFields, NewsController.createNews);
router.get("/", NewsController.getAllNews);
router.get("/:id", NewsController.getNewsById);
router.put("/:id", NewsController.updateNews);
router.delete("/:id", NewsController.deleteNews);

// -------------------- BANNER --------------------
router.post("/banner", uploadFields, NewsController.uploadBanner);
router.get("/banner", NewsController.getBanner); // ✅ MISSING GET FIXED

module.exports = router;
