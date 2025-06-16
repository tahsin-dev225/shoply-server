import { Router } from "express";
import { reviewService } from "./review.service.js";
const router = Router();

router.post('/',reviewService.addReview)

router.get('/:productId',reviewService.getProductReviews)

export const reviewsRoute = router