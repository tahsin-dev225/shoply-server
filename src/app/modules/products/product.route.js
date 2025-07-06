import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { productValidation } from "./productValidation.js";
import { productService } from "./product.service.js";
const router = Router();

router.post(
  "/",
  validationMiddleware(productValidation.createValidation),
  productService.addProduct
);

router.get("/", productService.getAllProducts);
router.get("/paginated", productService.getPaginatedProducts);
router.get("/leatest-product", productService.getLatestProducts);
router.get("/lowStock", productService.getLowStockProducts);
router.get("/topSelling", productService.topSelling10);
router.get("/getFeatured", productService.getFeaturedProducts);
router.get("/getFiltered", productService.getFilteredProducts);
router.get("/:id", productService.getSingleProduct);
router.get("/by-category/:category", productService.getProductsByCategory);

router.patch("/feature/:productId", productService.makeIsFeatured);
router.patch("/:id", productService.updateProduct);

router.delete("/:id", productService.deleteProduct);

export const productRoute = router;
