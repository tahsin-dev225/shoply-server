import { z } from "zod";

const createValidation = z.object({
  name: z.string({
    required_error: "Name is required",
  }).min(1, "Name cannot be empty"),

  email: z.string({
    required_error: "Email is required",
  }),

  role: z.string().optional(), // default: 'user' handled by Mongoose

  order: z.number().int().min(0).optional(), // default: 0

  totalSpent: z.number().min(0).optional() // default: 0
});

export const userValidation = {
  createValidation
};