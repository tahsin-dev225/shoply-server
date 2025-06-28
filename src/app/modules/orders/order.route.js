import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { orderValidation } from "./orderValidation.js";
import { orderService } from "./order.service.js";
const router = Router();

router.post('/',validationMiddleware(orderValidation.createValidation), orderService.addOrder);

router.get('/',orderService.getAllOrders );
router.get('/last30Days/orders', orderService.getLast30DaysOrdersCount);
router.get('/last30Days/earnings', orderService.getLast30DaysEarnings);
router.get("/stats/last5Months", orderService.getLast5MonthsStats);
router.get('/recentOrders',orderService.getRecentOrders );
router.get('/:userId', orderService.getSingleOrder );

export const orderRoute = router