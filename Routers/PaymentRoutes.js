const express = require("express");
const { CreatePayment, Success } = require("../Controllers/Handelpayment");
const RequireAuth = require("../Middlewares/RequireAuth");
const router = express.Router();


router.use(RequireAuth);
router.post("/", CreatePayment);
router.get("/success", Success);

module.exports = router;
