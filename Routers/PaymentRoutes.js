const express = require('express');
const { CreatePayment, Success } = require('../Controllers/Handelpayment');
const router=express.Router()

router.post("/",CreatePayment);
router.get("/success",Success);



module.exports=router
