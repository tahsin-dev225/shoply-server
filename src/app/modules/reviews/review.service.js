import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import reviewSchema from "./reviewSchema.js";
const Review = mongoose.model("Review", reviewSchema);

const addReview = catchAsync(async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    const existing = await Review.findOne({ userId, productId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    const review = new Review({
      userId,
      productId,
      rating,
      comment: comment || "",
    });
    await review.save();

    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getAllReviews = catchAsync(async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name") // Optional: populate user name
      .populate("productId", "name") // Optional: populate product name
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getProductReviews = catchAsync(async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name") // Optional: show user's name
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const getUsersAllReviews = catchAsync(async(req,res)=>{
    try {
        const {id} = req.params;
        const reviews = await Review.find({userId : id})

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export const reviewService = {
<<<<<<< HEAD
    addReview,
    getProductReviews,
    getAllReviews,
    getUsersAllReviews
}
=======
  addReview,
  getAllReviews,
  getProductReviews,
};
>>>>>>> dd63152e2c99a9935305ca229e8ac70f9b17f2e2
