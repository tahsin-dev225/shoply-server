import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import cartSchema from "./cartSchema.js";
const Cart = mongoose.model("Cart", cartSchema);

const addCartDetails = catchAsync(async (req, res) => {
    const { productId, userId } = req.body;

    const newCart = new Cart({ productId, userId });
    await newCart.save();

    res.status(201).json(newCart);
});

const getUserCart = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await Cart.find({ userId : userId }).populate("productId");

    if (!result) {
      return res.status(200).json({ message: "No cart found." });
    }
    res.status(200).json(result);
});

const getAllCart = catchAsync(async (req, res) => {
    const result = await Cart.find().populate('productId')
    .populate('userId');
    res.status(200).json(result);
});

const deleteCart = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deleted = await Cart.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.status(200).json({
    message: "Cart deleted successfully",
    deletedCart: deleted,
  });
});

export const cartService = {
  addCartDetails,
  getUserCart,
  getAllCart,
  deleteCart
};