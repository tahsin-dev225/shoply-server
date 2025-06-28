import { Router } from "express";
import { wishlistService } from "./wishlist.service.js";
const router = Router();

router.post('/',wishlistService.addWishlist)

router.get('/',wishlistService.getAllWishList)
router.get('/:userId', wishlistService.getWishlistByUserId)

export const wishlistRoute = router