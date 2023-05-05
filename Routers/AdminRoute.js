const express = require("express");
const {
  ApprovedAd,
  getPendingAds,
  getCounts,
  addAdminUser,
  getUsers,
  deleteuser,
  deactivateUser,
  getDeactivatedUsers,
  activateUser,
  rejectAd,
  getApprovedAds,
} = require("../Controllers/AdminData");
const {
  getAllpendingSponserAds,
  getAllApprovedSponserAds,
  approveSponserAd,
  rejectSponserAd,
} = require("../Controllers/HandelAdminSponserAds");
const { deleteApprovedAd } = require("../Controllers/HandleuserAds");
const { adminLogin } = require("../Controllers/AdminLogin");
const AdminAuth = require("../Middlewares/AdminAuth");
const router = express.Router();
router.use(AdminAuth);
router.get("/users", getUsers);
router.put("/users", deactivateUser);
router.delete("/users", deleteuser);
router.get("/users/deactivated", getDeactivatedUsers);
router.put("/users/deactivated", activateUser);
router.post("/newuser", addAdminUser);
router.get("/counts", getCounts);
router.get("/pending", getPendingAds);
router.get("/approvedads", getApprovedAds);
router.put("/approve", ApprovedAd);
router.delete("/reject", rejectAd);
router.delete("/deleteApproved", deleteApprovedAd);
router.get("/sponseredpending", getAllpendingSponserAds);
router.get("/sponseredapproved", getAllApprovedSponserAds);
router.put("/sponseredapproved", approveSponserAd);
router.delete("/sponseredreject", rejectSponserAd);
router.post("/login", adminLogin);
module.exports = router;
