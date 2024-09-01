const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv=require("dotenv");

dotEnv.config()

const secretKey=process.env.WhatIsYourName

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const findvendorEmail = await Vendor.findOne({ email });
        if (findvendorEmail) {
            return res.status(400).json({ message: "Vendor already registered!" });
        }
        
        const hashedpassword = await bcrypt.hash(password, 10);
        const newvendor = new Vendor({
            username,
            email,
            password: hashedpassword
        });
        await newvendor.save();
        
        res.status(201).json({ message: "Vendor successfully registered!" });
        console.log("Vendor registered:", newvendor);
    } catch (error) {
        console.error("Error:", error);
        if (error.code === 11000) {  // Handle duplicate key error specifically
            res.status(400).json({ message: "Email already in use!" });
        } else {
            res.status(500).json({ error: "Server Error" });
        }
    }
};

const vendorLogin = async(req,res)=>{
    const {email,password}=req.body
    try{
        const vendor = await Vendor.findOne({email});
        // console.log(vendor)
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"Invalid username or password"})
        }

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '1h' });

        res.status(201).json({success:"Login Successful",token})
        console.log(email,"This is my token",token);
    }catch(error){
        console.log("error",error)
        res.status(500).json({error:"server error"})
    }
}

const getAllVendors= async(req,res)=>{
    try {

        const allVendors= await Vendor.find().populate('Firm')
        res.status(200).json({allVendors})
        
    } catch (error) {
        console.log("error",error)
        res.status(500).json({error:"server error"})
        
    }
}

const getVenderById= async(req,res)=>{
    try {
        const vendor=await Vendor.findById(req.params.id).populate("Firm")
        if(!vendor){
            res.status(404).json({error:"Vendor not found"})
        }
        res.status(200).json({vendor})
        
    } catch (error) {
        console.log("error",error)
        res.status(500).json({error:"server error"})
        
    }
}

module.exports = { vendorRegister,vendorLogin,getAllVendors,getVenderById };
