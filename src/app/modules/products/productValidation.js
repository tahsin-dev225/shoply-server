import { z } from "zod";

const createValidation = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    image: z.string().url("Image must be a valid URL"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be a positive number"),

    // Optional or default values (optional in input, will be set on backend or DB default)
    rating: z.number().min(0).max(5).optional(),
    numReviews: z.number().min(0).optional(),
    inStock: z.boolean().optional(),
    sold: z.number().min(0).optional(),
    isFeatured: z.boolean().optional(),
})

export const productValidation = {
    createValidation
}