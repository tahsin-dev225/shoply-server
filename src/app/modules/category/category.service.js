import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import categorySchema from "./categorySchema.js";
const Category = mongoose.model("Category", categorySchema);

const addCategory = catchAsync(async (req, res) => {
  const { category, image, color } = req.body;
  const newCategory = new Category({ category, image, color });
  await newCategory.save();

  res.status(201).json(newCategory);
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await Category.find();
  res.status(200).json(result);
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.status(200).json(updatedCategory);
});

export const categoryService = {
  addCategory,
  getAllCategory,
  updateCategory,
};
