import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import categorySchema from "./categorySchema.js";
const Category = mongoose.model("Category",categorySchema)

const addCategory = catchAsync(async(req,res)=>{
    const { category  } = req.body;
    const newCategory = new Category({ category });
    await newCategory.save();

    res.status(201).json(newCategory);
})

const getAllCategory = catchAsync(async (req,res)=>{
    const result = await Category.find();
    res.status(200).json(result);
})


export const categoryService = {
    addCategory,
    getAllCategory
}