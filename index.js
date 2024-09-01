const express = require("express")
const dotEnv = require("dotenv")
const bodyParser = require("body-parser")
const mongoose =require("mongoose")
const vendorRoutes=require("./routes/vendorRoutes")
const firmRoutes=require("./routes/firmRoutes")
const productRoutes=require("./routes/productRoutes")
const path=require("path")

const app=express()

const PORT=process.env.PORT || 4000
dotEnv.config()
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("MongoDB connected successfully!")
})
.catch((error)=>{
    console.log(`Error: ${error}`)
})

app.use("/vendor",vendorRoutes)

app.use("/firm",firmRoutes)

app.use("/product",productRoutes)


app.use("/uploads",express.static("uploads"));




app.listen(PORT,()=>{
    console.log(`server is running on Port: ${PORT}`)
})