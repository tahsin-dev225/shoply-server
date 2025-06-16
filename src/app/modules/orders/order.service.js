import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import orderSchema from "./orderSchema.js";
const Order = mongoose.model("Order",orderSchema)

const addOrder = catchAsync(async(req,res)=>{
    try {
        const { product, userId,price } = req.body;

        const newProduct = new Order({ product, userId,price });
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
})

const getAllOrders = catchAsync(async (req,res)=>{
    try {
        const result = await Order.find();

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

const getSingleOrder = catchAsync(async (req,res)=>{
    try {
        const { id } = req.params;
        const result = await Order.findOne({ id });

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export const orderService = {
    addOrder,
    getAllOrders,
    getSingleOrder
}