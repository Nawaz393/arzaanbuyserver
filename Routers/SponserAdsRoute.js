const express = require("express");
const SponserPendingAd = require("../Models/SponserPendingAd");
const {
  addSponserPendingAd,
  getSponserPendingAds,
  getSponserApprovedAds,
  Success,
} = require("../Controllers/HandelSponserAds");
const {
  getAllApprovedSponserAds,
} = require("../Controllers/HandelAdminSponserAds");
const RequireAuth = require("../Middlewares/RequireAuth");
const router = express.Router();
// router.use(RequireAuth);
router.use((req, res, next) => {
  if (req.path !== '/all') {
    RequireAuth(req, res, next);
  } else {
    next();
  }
});
router.post("/user", addSponserPendingAd);
router.get("/user", getSponserPendingAds);
router.get("/success", Success);
router.get("/approved", getSponserApprovedAds);
router.get("/all", getAllApprovedSponserAds);

module.exports = router;
