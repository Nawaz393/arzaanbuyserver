const express = require("express");

const {
  updateuser,
  getuserdashboard,
  uploaduserimage,
  updatePassword,
} = require("../Controllers/HandleuserProfile");
const { PostAd } = require("../Controllers/HandleuserAds");

const RequireAuth = require("../Middlewares/RequireAuth");

const router = express.Router();
router.use(RequireAuth);
router.post("/updateinformation", updateuser);
router.get("/userdashboard", getuserdashboard);
router.post("/uploadprofile", uploaduserimage);
router.put("/updatepass", updatePassword);
router.post("/pending", PostAd);



module.exports = router;
