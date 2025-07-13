import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import orderSchema from "./orderSchema.js";
import User from "../users/userSchema.js";
import { Product } from "../products/product.service.js";
import { Cart } from "../addToCart/cart.service.js";
const Order = mongoose.model("Order", orderSchema);

// import SSLCommerzPayment from "sslcommerz-lts";
// import { v4 as uuidv4 } from "uuid"; // For unique transaction id

// const store_id = process.env.SSLCOMMERZ_STORE_ID;
// const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
// const isLive = false; // true হলে live, false হলে sandbox

const addOrder = catchAsync(async (req, res) => {
    const { userId, products,address,paymentMethod } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "No products provided" });
  }

  let totalPrice = 0;
  const finalProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Product nott  found: ${item.productId}` });
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
    address,
    paymentMethod,
    totalPrice
  });
  console.log(newOrder)
  await newOrder.save();
  await Cart.deleteMany({userId})

  await User.findByIdAndUpdate(userId, {
    $inc: {
      order: 1,
      totalSpent: totalPrice
    }
  });

  res.status(201).json(newOrder);
});

// const initiateSSLCommerzPayment =catchAsync( async (req, res) => {
//   const { userId, products, address, totalPrice } = req.body;

//   if (!products || products.length === 0) {
//     return res.status(400).json({ message: "No products provided" });
//   }

//   const tran_id = uuidv4();

//   const data = {
//     total_amount: totalPrice,
//     currency: "BDT",
//     tran_id,
//     success_url: `http://localhost:5000/api/v1/orders/payment-success?tran_id=${tran_id}`,
//     fail_url: `http://localhost:5000/api/v1/orders/payment-fail?tran_id=${tran_id}`,
//     cancel_url: `http://localhost:5000/api/v1/orders/payment-cancel`,
//     ipn_url: `http://localhost:5000/api/v1/orders/ipn`,

//     product_name: "Your Store Products",
//     product_category: "Ecommerce",
//     product_profile: "general",
//     cus_name: address?.name || "N/A",
//     cus_email: "customer@email.com",
//     cus_add1: address?.street || "N/A",
//     cus_city: address?.district || "N/A",
//     cus_state: address?.thana || "N/A",
//     cus_postcode: "1000",
//     cus_country: "Bangladesh",
//     cus_phone: address?.phone || "N/A",

//     shipping_method: "Courier",
//     ship_name: address?.name || "N/A",
//     ship_add1: address?.street || "N/A",
//     ship_city: address?.district || "N/A",
//     ship_state: address?.thana || "N/A",
//     ship_postcode: "1000",
//     ship_country: "Bangladesh",
//   };

//   const sslcz = new SSLCommerzPayment(store_id, store_passwd, isLive);
//   sslcz.init(data)
//   .then((apiResponse) => {
//     // Redirect user to SSLCommerz
//     const GatewayPageURL = apiResponse.GatewayPageURL;
//     res.status(200).json({ url: GatewayPageURL });
//   }).catch(error => {
//     res.status(500).json({ message: "Payment initialization failed", error });
//   });
// });

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
      .populate('userId')
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
