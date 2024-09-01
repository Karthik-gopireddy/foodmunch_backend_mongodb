const express=require("express")
const router=express.Router()
const Vendor=require("../models/Vendor")
const vendorControllers=require("../controllers/vendorControllers")

router.post("/register",vendorControllers.vendorRegister);
router.post("/login",vendorControllers.vendorLogin);
router.get("/all-vendors",vendorControllers.getAllVendors)
router.get("/single-vendor/:id",vendorControllers.getVenderById)

module.exports=router