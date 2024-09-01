const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save the uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;
        
        // Check if the firm name already exists
        const existingFirm = await Firm.findOne({ firmName });
        if (existingFirm) {
            return res.status(400).json({ message: "Firm name already exists. Please choose a different name." });
        }

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const firm = new Firm({
            firmName, area, category, region, offer, image, vendor: vendor._id
        });
        
        const savedFirm = await firm.save();
        vendor.Firm.push(savedFirm);
        await vendor.save();
        
        return res.status(201).json({ message: "Firm added successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
};


const deleteFirmById= async(req,res)=>{
    try {
        const firmId=req.params.firmId;

        const deletedFirm=await Firm.findByIdAndDelete(firmId)

        if(!deletedFirm){
            return res.status(404).json({error:"No Firm found!"})
        }
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ error: "Server error" });
        
        
    }
}


module.exports = { addFirm: [upload.single("image"), addFirm],deleteFirmById };
