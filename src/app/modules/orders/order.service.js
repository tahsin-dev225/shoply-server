import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import orderSchema from "./orderSchema.js";
const Order = mongoose.model("Order", orderSchema);

const addOrder = catchAsync(async (req, res) => {
  try {
    const { productId, quantity, userId, price } = req.body;

    const newOrder = new Order({ productId, quantity, userId, price });
    await newOrder.save();

    await User.findByIdAndUpdate(userId, {
      $inc: {
        order: 1,
        totalSpent: price
      }
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getAllOrders = catchAsync(async (req, res) => {
  try {
    const result = await Order.find().populate('productId')
    .populate('userId');

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getSingleOrder = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await Order.findOne({ userId: userId });

    if (!result) {
      return res.status(200).json({ message: "No order found." });
    }
    res.status(200).json([result]);
});

const getRecentOrders = catchAsync(async (req, res) => {
  try {
    const result = await Order.find()
      .sort({ createdAt: -1 }) // Sort by newest
      .limit(3); // Last 3 orders

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getLast30DaysOrdersCount = catchAsync(async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const count = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({ totalOrders: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getLast30DaysEarnings = catchAsync(async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$price" },
        },
      },
    ]);

    const totalEarnings = result[0]?.totalEarnings || 0;

    res.status(200).json({ totalEarnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getLast5MonthsStats = catchAsync(async (req, res) => {
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 4);

  const stats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(fiveMonthsAgo) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalOrders: { $sum: 1 },
        totalEarnings: { $sum: "$price" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json(stats);
});

export const orderService = {
  addOrder,
  getAllOrders,
  getSingleOrder,
  getRecentOrders,
  getLast30DaysOrdersCount,
  getLast30DaysEarnings,
  getLast5MonthsStats
};
