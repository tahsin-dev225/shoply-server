import { Router } from "express";
import validationMiddleware from "../../helper/validateJod";
import { productValidation } from "./productValidation";
import { productService } from "./product.service";
const router = Router();

router.post('/',validationMiddleware(productValidation.createValidation), productService.addProduct)

router.get('/', productService.getAllProducts )
router.get('/:id', productService.getSingleProduct )

export const userRoute = router