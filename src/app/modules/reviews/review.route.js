import { Router } from "express";
import { reviewService } from "./review.service.js";
import validationMiddleware from "../../helper/validateJod.js";
import { reviewValidation } from "./reviewValidation.js";
const router = Router();

router.post(
  "/",
  validationMiddleware(reviewValidation.createValidation),
  reviewService.addReview
);

router.get("/", reviewService.getAllReviews);
router.get("/usersAll/:id", reviewService.getUsersAllReviews);
router.get("/:productId", reviewService.getProductReviews);
router.delete("/:id", reviewService.deleteReview);

export const reviewsRoute = router;
