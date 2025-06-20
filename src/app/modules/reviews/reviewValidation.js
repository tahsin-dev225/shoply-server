import { z } from "zod";

const createValidation = z.object({
  userId: z.string().min(1, "userId is required"),
  productId: z.string().min(1, "productId is required"),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),
  comment: z.string().optional()
});

export const reviewValidation = {
  createValidation
};