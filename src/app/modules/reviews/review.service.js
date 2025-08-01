import mongoose, { get } from "mongoose";
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

const getUsersAllReviews = catchAsync(async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ userId: id });

  res.status(200).json(reviews);
});

const getPaginatedReviews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;

  const matchStage = {};

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $match: {
        $or: [
          { "user.name": { $regex: search, $options: "i" } },
          { "product.name": { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $facet: {
        reviews: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Review.aggregate(pipeline);

  const reviews = result[0].reviews;
  const total = result[0].totalCount[0]?.count || 0;

  res.status(200).json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    reviews,
  });
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.query.userId;
    const role = req.query.role;

    if (!userId || !role) {
      return res.status(400).json({ message: "User info required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (role !== "admin" && review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const reviewService = {
  addReview,
  getProductReviews,
  getAllReviews,
  getUsersAllReviews,
  deleteReview,
  getPaginatedReviews,
};
