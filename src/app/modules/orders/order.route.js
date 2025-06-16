import { Router } from "express";
import validationMiddleware from "../../helper/validateJod";
import { orderValidation } from "./orderValidation";
import { orderService } from "./order.service";
const router = Router();

router.post('/',validationMiddleware(orderValidation.createValidation), orderService.addOrder)

router.get('/',orderService.getAllOrders )
router.get('/:email', orderService.getSingleOrder )

export const orderRoute = router