const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save the uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firm = await Firm.findById(req.params.firmId);
        if (!firm) {
            return res.status(404).json({ error: "Firm not found!" });
        }

        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id,
        });

        const savedProduct = await product.save();
        firm.product.push(savedProduct);
        await firm.save();

        return res.status(201).json({ message: "Product created successfully!" });
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ error: "Server error" });
    }

};


const getProductByFirm=async(req,res)=>{
    try {
        const firmId = req.params.firmId

        const firm=await Firm.findById(firmId);
      
        if(!firm){
            return res.status(404).json({error:"No firm found"});

        }

        const restaurantName=firm.firmName;

        const products=await Product.find({firm:firmId})

        res.status(200).json({restaurantName,products});

        
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ error: "Server error" });
        
    }
}

const deleteProductById= async(req,res)=>{
    try {
        const productId=req.params.productId;

        const deletedProduct=await Product.findByIdAndDelete(productId)

        if(!deletedProduct){
            return res.status(404).json({error:"No Product found!"})
        }
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ error: "Server error" });
        
        
    }
}




module.exports = { addProduct: [upload.single("image")], addProduct,getProductByFirm,deleteProductById };
