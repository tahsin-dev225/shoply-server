import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { productValidation } from "./productValidation.js";
import { productService } from "./product.service.js";
const router = Router();

router.post('/',validationMiddleware(productValidation.createValidation), productService.addProduct)

router.get('/', productService.getAllProducts )
router.get('/paginated', productService.getPaginatedProducts )
router.get('/leatest-product', productService.getLatestProducts )
router.get('/:id', productService.getSingleProduct )

export const productRoute = router