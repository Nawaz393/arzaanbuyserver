const express = require("express");
const {
  deletependingAd,
  getUserPendingAds,
  updateApprovedAd,
  deleteApprovedAd,
  getUserApprovedAds,
} = require("../Controllers/HandleuserAds");
const {
  getFromHistory,
  deleteFromHistory,
} = require("../Controllers/Historyhandler");

const RequireAuth = require("../Middlewares/RequireAuth");

const router = express.Router();

router.use(RequireAuth);

router.get("/pending", getUserPendingAds);
router.delete("/pending", deletependingAd);
router.get("/approved", getUserApprovedAds);
router.put("/approved", updateApprovedAd);
router.delete("/approved", deleteApprovedAd);
router.get("/history", getFromHistory);
router.delete("/history", deleteFromHistory);

module.exports = router;
