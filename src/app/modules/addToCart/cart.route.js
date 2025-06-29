import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { cartValidation } from "./cartValidation.js";
import { cartService } from "./cart.service.js";
const router = Router();

router.post('/',validationMiddleware(cartValidation.createValidation), cartService.addCartDetails);

router.get('/',cartService.getAllCart);
router.get('/userCart/:userId', cartService.getUserCart);

router.delete("/:id", cartService.deleteCart);

export const cartRoute = router