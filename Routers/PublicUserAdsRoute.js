const express = require("express");

const {
  getApprovedAd,
  getByCategory,
  getsingleProduct,
  searchByNames,
} = require("../Controllers/HandelpublicAds");

const router = express.Router();

router.get("/approved", getApprovedAd);
router.get("/approved/catagory", getByCategory);
router.get("/approved/single", getsingleProduct);
router.get("/approved/search", searchByNames);

module.exports = router;
