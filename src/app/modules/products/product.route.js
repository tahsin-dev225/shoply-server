import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { productValidation } from "./productValidation.js";
import { productService } from "./product.service.js";
const router = Router();

router.post('/',validationMiddleware(productValidation.createValidation), productService.addProduct)

router.get('/', productService.getAllProducts )
router.get('/paginated', productService.getPaginatedProducts )
router.get('/:id', productService.getSingleProduct )
router.get('/letest-product', productService.getLatestProducts )

export const productRoute = router