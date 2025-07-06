import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import productSchema from "./productSchema.js";
export const Product = mongoose.model("Product",productSchema)

const addProduct = catchAsync(async(req,res)=>{
        const { name, category,image,price,description , stock   } = req.body;

        const newProduct = new Product({ name, category,image,price,description ,stock });
        await newProduct.save();

        res.status(201).json(newProduct);
})

const getAllProducts = catchAsync(async (req,res)=>{
        const result = await Product.find();

        res.status(200).json(result);
})

const getSingleProduct = catchAsync(async (req, res) => {
        const { id } = req.params;
        const result = await Product.findOne({ _id: id });

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(result);
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
  const topProducts = await Product.find().sort({ sold: -1 }).limit(8);

  res.status(200).json(topProducts);
});

const makeIsFeatured = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const { isFeatured } = req.body;

    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({ message: "isFeatured must be true or false" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isFeatured },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: `Product marked as ${isFeatured ? "featured" : "not featured"}`,
      product: updatedProduct,
    });
});

const getFeaturedProducts = catchAsync(async (req, res) => {
    const featuredProducts = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json(featuredProducts);
});

const getProductsByCategory = catchAsync(async (req, res) => {
    const { category } = req.params;
    console.log(category)
    const products = await Product.find({ category : category });
    console.log(products)
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }
    res.status(200).json(products);
});


const getFilteredProducts = catchAsync(async (req, res) => {
    const { min, max, rating, inStock, categories, sort } = req.query;
    const filter = {};

    // Price Range
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    // Rating
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // Availability
    if (inStock === "true") {
      filter.inStock = true;
    } else if (inStock === "false") {
      filter.inStock = false;
    }

    // Categories (multiple)
    if (categories) {
      const categoryList = categories.split(",");
      filter.category = { $in: categoryList };
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "popularity") sortOption = { sold: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json(products);
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
    makeIsFeatured,
    getFeaturedProducts,
    getProductsByCategory,
    getFilteredProducts
}
