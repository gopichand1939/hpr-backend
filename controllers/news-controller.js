const NewsModel = require("../models/news-model");

const NewsController = {
  // -------------------- NEWS CRUD --------------------

  // Create a news item with optional images
  async createNews(req, res) {
    try {
      const { title, short_description, full_description, posted_date } = req.body;

      console.log("[CONTROLLER] createNews called");

      const newsId = await NewsModel.createNews(
        title,
        short_description,
        full_description,
        posted_date
      );

      // Handle multiple images
      if (req.files && req.files.images) {
        for (const file of req.files.images) {
          await NewsModel.addNewsImage(newsId, file.buffer);
        }
      }

      console.log(`[CONTROLLER] News created with ID: ${newsId}`);
      res.status(201).json({ message: "News created", id: newsId });
    } catch (err) {
      console.error("Error creating news:", err);
      res.status(500).json({ error: "Failed to create news" });
    }
  },

  // Get all news (for cards list)
  async getAllNews(req, res) {
    try {
      console.log("[CONTROLLER] getAllNews called");

      const newsList = await NewsModel.getAllNews();

      // Attach first image for each news card (if exists)
      for (const news of newsList) {
        const images = await NewsModel.getImagesByNewsId(news.id);
        if (images.length > 0) {
          news.images = [images[0]]; // Only send preview image
        } else {
          news.images = [];
        }
      }

      res.json({ data: newsList });
    } catch (err) {
      console.error("Error fetching news:", err);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  },

  // Get full news by ID (modal)
  async getNewsById(req, res) {
    try {
      const id = req.params.id;
      console.log(`[CONTROLLER] getNewsById called for ID: ${id}`);

      const news = await NewsModel.getNewsById(id);
      if (!news) return res.status(404).json({ error: "News not found" });

      const images = await NewsModel.getImagesByNewsId(id);
      news.images = images;

      res.json({ data: news });
    } catch (err) {
      console.error("Error fetching news by ID:", err);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  },

  // Update a news item
  async updateNews(req, res) {
    try {
      const id = req.params.id;
      const { title, short_description, full_description, posted_date } = req.body;

      console.log(`[CONTROLLER] updateNews called for ID: ${id}`);

      await NewsModel.updateNews(
        id,
        title,
        short_description,
        full_description,
        posted_date
      );

      res.json({ message: "News updated" });
    } catch (err) {
      console.error("Error updating news:", err);
      res.status(500).json({ error: "Failed to update news" });
    }
  },

  // Delete a news item
  async deleteNews(req, res) {
    try {
      const id = req.params.id;
      console.log(`[CONTROLLER] deleteNews called for ID: ${id}`);

      await NewsModel.deleteNews(id);

      res.json({ message: "News deleted" });
    } catch (err) {
      console.error("Error deleting news:", err);
      res.status(500).json({ error: "Failed to delete news" });
    }
  },

  // -------------------- BANNER --------------------

  // Upload or replace the banner image
  async uploadBanner(req, res) {
    try {
      console.log("[CONTROLLER] uploadBanner called");

      if (!req.files || !req.files.banner || req.files.banner.length === 0) {
        return res.status(400).json({ error: "No banner file provided" });
      }

      const bannerFile = req.files.banner[0];

      await NewsModel.setBannerImage(bannerFile.buffer);

      res.status(200).json({ message: "Banner uploaded successfully" });
    } catch (err) {
      console.error("Error uploading banner:", err);
      res.status(500).json({ error: "Failed to upload banner" });
    }
  },

  // Get the current banner image
  async getBanner(req, res) {
    try {
      console.log("[CONTROLLER] getBanner called");

      const banner = await NewsModel.getBannerImage();

      if (!banner) return res.status(404).json({ error: "No banner found" });

      res.set("Content-Type", "image/jpeg");
      res.send(banner.image_blob);
    } catch (err) {
      console.error("Error fetching banner:", err);
      res.status(500).json({ error: "Failed to fetch banner" });
    }
  },
};

module.exports = NewsController;
