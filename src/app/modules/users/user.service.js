import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import userSchema from "./userSchema.js";
const User = mongoose.model("User",userSchema)

const addUser = catchAsync(async(req,res)=>{
    try {
        const { name, email,role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists with this email." });

        const newUser = new User({ name, email,role });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
})

const getUserWithEmail = catchAsync(async (req,res)=>{
    try {
        const { email } = req.params;
        const result = await User.findOne({ email });

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export const userService = {
    addUser,
    getUserWithEmail
}