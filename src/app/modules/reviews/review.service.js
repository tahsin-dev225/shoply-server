import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import reviewSchema from "./reviewSchema.js";
const Review = mongoose.model("Review",reviewSchema)

const addReview = catchAsync( async (req, res) => {
    try {
        const { userId, productId, rating, comment } = req.body;

        const existing = await Review.findOne({ userId, productId });
        if (existing) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }

        const review = new Review({ userId, productId, rating, comment });
        await review.save();

        res.status(201).json({ message: "Review added", review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getProductReviews = catchAsync(async(req,res)=>{
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId })
            .populate("userId", "name") // Optional: show user's name
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export const reviewService = {
    addReview,
    getProductReviews
}