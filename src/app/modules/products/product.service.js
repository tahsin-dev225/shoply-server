import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import productSchema from "./productSchema.js";
const Product = mongoose.model("Product",productSchema)

const addProduct = catchAsync(async(req,res)=>{
    try {
        const { name, email,price } = req.body;
        // const existing = await User.findOne({ email });
        // if (existing) return res.status(400).json({ message: "User already exists with this email." });

        const newProduct = new Product({ name, email,price });
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
})

const getAllProduct = catchAsync(async (req,res)=>{
    try {
        const result = await Product.find();

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

const getSingleProduct = catchAsync(async (req,res)=>{
    try {
        const { id } = req.params;
        const result = await Product.findOne({ id });

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export const productService = {
    addProduct,
    getAllProduct,
    getSingleProduct
}