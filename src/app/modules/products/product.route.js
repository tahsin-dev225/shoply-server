import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { productValidation } from "./productValidation.js";
import { productService } from "./product.service.js";
const router = Router();

// Create
router.post(
  "/",
  validationMiddleware(productValidation.createValidation),
  productService.addProduct
);

// Get many
router.get("/paginated", productService.getPaginatedProducts);
router.get("/leatest-product", productService.getLatestProducts);
router.get("/lowStock", productService.getLowStockProducts);
router.get("/topSelling", productService.topSelling10);
router.get("/getFeatured", productService.getFeaturedProducts);
router.get("/getFiltered", productService.getFilteredProducts);
router.get("/price-range", productService.getProductsByPriceRange);
router.get("/by-category/:category", productService.getProductsByCategory);
router.get("/filteredProducts", productService.getFilteredProduct);

// Feature toggle
router.patch("/feature/:productId", productService.makeIsFeatured);

// Single item (keep at END)
router.get("/:id", productService.getSingleProduct);
router.patch("/:id", productService.updateProduct);
router.delete("/:id", productService.deleteProduct);

export const productRoute = router;
