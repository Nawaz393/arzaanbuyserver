const express = require("express");

const {
  registerUser,
  verifyOTP,
  getUser,
  loginUser,
  forgotPassword,
  verifyForgotPassword,
} = require("../Controllers/userData");

const router = express.Router();
router.get("/", getUser);
router.post("/register", registerUser);
router.post("/verify", verifyOTP);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.put("/verifyforgotpassword", verifyForgotPassword);

module.exports = router;
