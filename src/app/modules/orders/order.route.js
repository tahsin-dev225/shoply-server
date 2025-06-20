import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { orderValidation } from "./orderValidation.js";
import { orderService } from "./order.service.js";
const router = Router();

router.post('/',validationMiddleware(orderValidation.createValidation), orderService.addOrder)

router.get('/',orderService.getAllOrders )
router.get('/:userId', orderService.getSingleOrder )

export const orderRoute = router