import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import orderSchema from "./orderSchema.js";
import User from "../users/userSchema.js";
import { Product } from "../products/product.service.js";
const Order = mongoose.model("Order", orderSchema);

const addOrder = catchAsync(async (req, res) => {
    const { userId, products } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "No products provided" });
  }

  let totalPrice = 0;
  const finalProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.productId}` });
    }

    const quantity = item.quantity || 1;
    const itemTotal = product.price * quantity;
    totalPrice += itemTotal;

    finalProducts.push({
      productId: product._id,
      quantity,
      price: product.price,
    });
  }

  const newOrder = new Order({
    userId,
    products: finalProducts,
    totalPrice,
  });
  await newOrder.save();

  await User.findByIdAndUpdate(userId, {
    $inc: {
      order: 1,
      totalSpent: totalPrice
    }
  });

  res.status(201).json(newOrder);
});

const getAllOrders = catchAsync(async (req, res) => {
    const result = await Order.find()
      .populate('userId')
      .populate('products.productId');

    res.status(200).json(result);
});

const getUserOrder = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await Order.find({ userId }).populate("products.productId");

    if (!result) {
      return res.status(200).json({ message: "No order found." });
    }
    res.status(200).json(result);
});

const updateOrderStatus = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log('order',orderId,status)
    // const validStatuses = ["processing", "courier", "delivered", "cancelled"];

    // if (!validStatuses.includes(status)) {
    //   return res.status(400).json({ message: "Invalid status value" });
    // }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
    });
});

const getUserOrderProductDetails = catchAsync(async (req, res) => {
    const { userId,productId } = req.query;
    const result = await Order.find({ userId }).populate("products.productId");

    if (!result) {
      return res.status(200).json({ message: "No order found." });
    }
    res.status(200).json(result);
});

const getRecentOrders = catchAsync(async (req, res) => {
  try {
    const result = await Order.find()
      .populate('products.productId')
      .sort({ createdAt: -1 }) 
      .limit(3); 

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
          totalEarnings: { $sum: "$totalPrice" },
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

const deleteAllOrders = catchAsync(async (req, res) => {
  try {
    const result = await Order.deleteMany({}); // 🧹 delete all documents

    res.status(200).json({
      message: "All orders deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const orderService = {
  addOrder,
  getAllOrders,
  getUserOrder,
  getRecentOrders,
  getLast30DaysOrdersCount,
  getLast30DaysEarnings,
  getLast5MonthsStats,
  deleteAllOrders,
  updateOrderStatus
};
