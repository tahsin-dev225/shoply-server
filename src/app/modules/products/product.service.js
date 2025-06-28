import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import productSchema from "./productSchema.js";
const Product = mongoose.model("Product", productSchema);

const addProduct = catchAsync(async (req, res) => {
  try {
    const { name, category, image, price, description, stock } = req.body;
    // const existing = await User.findOne({ email });
    // if (existing) return res.status(400).json({ message: "User already exists with this email." });

    const newProduct = new Product({
      name,
      category,
      image,
      price,
      description,
      stock,
    });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getAllProducts = catchAsync(async (req, res) => {
  try {
    const result = await Product.find();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getSingleProduct = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findOne({ _id: id });

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getLatestProducts = catchAsync(async (req, res) => {
  const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(6);

  res.status(200).json(latestProducts);
});

const getPaginatedProducts = catchAsync(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default page 1
    const limit = 10;

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Product.countDocuments();

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
    new: true, // return updated document
    runValidators: true, // validate according to schema
  });

  if (!updatedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({
    message: "Product deleted successfully",
    deletedProduct: deleted,
  });
});

const getLowStockProducts = catchAsync(async (req, res) => {
  try {
    const lowStock = await Product.find({ stock: { $lt: 5 } }).sort({
      stock: 1,
    });
    res.status(200).json(lowStock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const topSelling10 = catchAsync(async (req, res) => {
  const topProducts = await Product.find().sort({ sold: -1 }).limit(10);

  res.status(200).json(topProducts);
});

export const productService = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  getLatestProducts,
  getPaginatedProducts,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  topSelling10,
};
