const express = require("express");
const router = express.Router();
const missionCtrl = require("../controllers/mission-statement-controller");

router.get("/", missionCtrl.getMission);
router.put("/", missionCtrl.updateMission);

module.exports = router;
