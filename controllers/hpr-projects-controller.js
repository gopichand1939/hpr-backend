const HprProjectsModel = require("../models/hpr-projects-model");

const HprProjectsController = {
  // -------------------- PROJECTS MAIN --------------------
  createProject: async (req, res) => {
    try {
      const { name, category, short_desc } = req.body;
      const logo = req.files?.logo?.[0]?.buffer || null;
      const banner = req.files?.banner?.[0]?.buffer || null;
      const id = await HprProjectsModel.createProject(name, category, short_desc, logo, banner);
      res.status(201).json({ id });
    } catch (err) {
      console.error("createProject error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAllProjects: async (req, res) => {
    try {
      const data = await HprProjectsModel.getAllProjects();
      res.json(data);
    } catch (err) {
      console.error("getAllProjects error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  getProjectById: async (req, res) => {
    try {
      const data = await HprProjectsModel.getProjectById(req.params.id);
      res.json(data);
    } catch (err) {
      console.error("getProjectById error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateProject: async (req, res) => {
    try {
      const { name, category, short_desc } = req.body;
      const logo = req.files?.logo?.[0]?.buffer || null;
      const banner = req.files?.banner?.[0]?.buffer || null;
      await HprProjectsModel.updateProject(req.params.id, name, category, short_desc, logo, banner);
      res.json({ success: true });
    } catch (err) {
      console.error("updateProject error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteProject: async (req, res) => {
    try {
      await HprProjectsModel.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("deleteProject error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // -------------------- UTILITIES --------------------
  getProjectNames: async (req, res) => {
    try {
      const data = await HprProjectsModel.getProjectNames();
      res.json(data);
    } catch (err) {
      console.error("getProjectNames error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

getGalleryByCategory: async (req, res) => {
  try {
    const data = await HprProjectsModel.getGalleryByCategory(req.params.category);
    
    const formatted = data.map(item => ({
      ...item,
      image_blob: item.image_blob ? item.image_blob.toString("base64") : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getGalleryByCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
},


  // -------------------- HOME --------------------
createHome: async (req, res) => {
  try {
    const { title, description } = req.body;
    const project_id = parseInt(req.body.project_id, 10); // ✅ Ensures integer
    const brochure = req.files?.brochure?.[0]?.buffer || null;
    const image = req.files?.image?.[0]?.buffer || null;

    // ✅ Debug logs
    console.log("[DEBUG] createHome - project_id:", project_id);
    console.log("[DEBUG] createHome - title:", title);
    console.log("[DEBUG] createHome - description:", description);
    console.log("[DEBUG] createHome - brochure buffer length:", brochure?.length);
    console.log("[DEBUG] createHome - image buffer length:", image?.length);

    const id = await HprProjectsModel.createHome(project_id, title, description, brochure, image);

    res.status(201).json({ id });
  } catch (err) {
    console.error("createHome error:", err);
    res.status(500).json({ message: "Server error" });
  }
},


  getHomeByProjectId: async (req, res) => {
    try {
      const data = await HprProjectsModel.getHomeByProjectId(req.params.project_id);
      res.json(data);
    } catch (err) {
      console.error("getHomeByProjectId error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateHome: async (req, res) => {
    try {
      const { title, description } = req.body;
      const brochure = req.files?.brochure?.[0]?.buffer || null;
      const image = req.files?.image?.[0]?.buffer || null;
      await HprProjectsModel.updateHome(req.params.id, title, description, brochure, image);
      res.json({ success: true });
    } catch (err) {
      console.error("updateHome error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteHome: async (req, res) => {
    try {
      await HprProjectsModel.deleteHome(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("deleteHome error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  

  // -------------------- GALLERY --------------------
// -------------------- GALLERY --------------------
// -------------------- GALLERY CONTROLLER --------------------
addGalleryImage: async (req, res) => {
  try {
    const { project_id, work_date, description } = req.body;
    const image = req.file?.buffer || null;

    // 🆕 Fetch project category
    const project = await HprProjectsModel.getProjectById(project_id);
    const category = project?.category || null;

    if (!project_id || !work_date || !description || !image || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    await HprProjectsModel.addGalleryImage(project_id, work_date, description, image, category);
    res.status(201).json({ success: true, message: "Gallery image uploaded successfully" });
  } catch (err) {
    console.error("addGalleryImage error:", err);
    res.status(500).json({ message: "Server error while adding gallery image" });
  }
},


getGalleryByProjectId: async (req, res) => {
  try {
    const data = await HprProjectsModel.getGalleryByProjectId(req.params.project_id);
    const formatted = data.map(item => ({
      id: item.id,
      project_id: item.project_id,
      work_date: item.work_date,
      description: item.description,
      image_blob: item.image_blob
        ? item.image_blob.toString("base64")  // ✅ Base64 conversion here
        : null,
    }));
    res.json(formatted);
  } catch (err) {
    console.error("getGalleryByProjectId error:", err);
    res.status(500).json({ message: "Server error while fetching gallery data" });
  }
},

deleteGalleryImage: async (req, res) => {
  try {
    await HprProjectsModel.deleteGalleryImage(req.params.id);
    res.json({ success: true, message: "Gallery image deleted successfully" });
  } catch (err) {
    console.error("deleteGalleryImage error:", err);
    res.status(500).json({ message: "Server error while deleting gallery image" });
  }
},

// -------------------- PLAN --------------------
addPlan: async (req, res) => {
  try {
    const { project_id, description } = req.body;
    const plan = req.file?.buffer ?? null;

    if (!project_id || !description || !plan) {
      return res.status(400).json({ success: false, message: "All fields (project_id, description, plan) are required." });
    }

    await HprProjectsModel.addPlan(project_id, description, plan);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("addPlan error:", err);
    res.status(500).json({ message: "Server error" });
  }
},

getPlanByProjectId: async (req, res) => {
  try {
    const projectId = req.params.project_id ?? null;
    const data = await HprProjectsModel.getPlanByProjectId(projectId);
    res.json(data);
  } catch (err) {
    console.error("getPlanByProjectId error:", err);
    res.status(500).json({ message: "Server error" });
  }
},

updatePlan: async (req, res) => {
  try {
    const { description } = req.body;
    const plan = req.file?.buffer ?? null;
    const planId = req.params.id ?? null;

    if (!planId || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    await HprProjectsModel.updatePlan(planId, description, plan);
    res.json({ success: true });
  } catch (err) {
    console.error("updatePlan error:", err);
    res.status(500).json({ message: "Server error" });
  }
},

deletePlan: async (req, res) => {
  try {
    const id = req.params.id ?? null;
    await HprProjectsModel.deletePlan(id);
    res.json({ success: true });
  } catch (err) {
    console.error("deletePlan error:", err);
    res.status(500).json({ message: "Server error" });
  }
},


  // -------------------- LOCATION --------------------
  addLocation: async (req, res) => {
    try {
      const { project_id, iframe_link } = req.body;
      await HprProjectsModel.addLocation(project_id, iframe_link);
      res.status(201).json({ success: true });
    } catch (err) {
      console.error("addLocation error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

getLocationByProjectId: async (req, res) => {
  try {
    const data = await HprProjectsModel.getLocationByProjectId(req.params.project_id);

    const formatted = Array.isArray(data)
      ? data.map((item) => ({
          id: item.id,
          project_id: item.project_id,
          title: "Map Location", // ✅ Dummy title since it's not in DB
          map_url: item.iframe_link, // ✅ Correctly map field
        }))
      : [];

    res.json(formatted);
  } catch (err) {
    console.error("getLocationByProjectId error:", err);
    res.status(500).json({ message: "Server error" });
  }
},


  updateLocation: async (req, res) => {
    try {
      const { iframe_link } = req.body;
      await HprProjectsModel.updateLocation(req.params.id, iframe_link);
      res.json({ success: true });
    } catch (err) {
      console.error("updateLocation error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteLocation: async (req, res) => {
    try {
      await HprProjectsModel.deleteLocation(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("deleteLocation error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },


// -------------------- AMENITIES --------------------
addAmenities: async (req, res) => {
  try {
    const { project_id, infrastructure, features } = req.body;
    await HprProjectsModel.addAmenities(project_id, JSON.parse(infrastructure), JSON.parse(features));
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("addAmenities error:", err);
    res.status(500).json({ message: "Server error" });
  }
},

getAmenitiesByProjectId: async (req, res) => {
  try {
    const data = await HprProjectsModel.getAmenitiesByProjectId(req.params.project_id);
    res.json(data);
  } catch (err) {
    console.error("getAmenitiesByProjectId error:", err);
    res.status(500).json({ message: "Server error" });
  }
},

updateAmenities: async (req, res) => {
  try {
    const { infrastructure, features } = req.body;
    await HprProjectsModel.updateAmenities(req.params.id, JSON.parse(infrastructure), JSON.parse(features));
    res.json({ success: true });
  } catch (err) {
    console.error("updateAmenities error:", err);
    res.status(500).json({ message: "Server error" });
  }
},

deleteAmenities: async (req, res) => {
  try {
    await HprProjectsModel.deleteAmenities(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("deleteAmenities error:", err);
    res.status(500).json({ message: "Server error" });
  }
},

getAmenitiesById: async (req, res) => {
  try {
    const data = await HprProjectsModel.getAmenitiesById(req.params.id);
    res.json(data);
  } catch (err) {
    console.error("getAmenitiesById error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
,




  // -------------------- CONTACT FORM --------------------
  submitContactForm: async (req, res) => {
    try {
      const { name, email, phone, message, project_name } = req.body;
      await HprProjectsModel.submitContactForm(name, email, phone, message, project_name);
      res.status(201).json({ success: true });
    } catch (err) {
      console.error("submitContactForm error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = HprProjectsController;
