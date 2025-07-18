import { z } from "zod";

const orderProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().nonnegative("Price must be a positive number").optional(),
});

const addressValidation = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone is required"),
  street: z.string().min(1, "Street is required"),
  thana: z.string().min(1, "Thana is required"),
  district: z.string().min(1, "District is required"),
  houseNumber: z.string().optional()
});

const createValidation = z.object({
  products: z
    .array(orderProductSchema)
    .min(1, "At least one product is required"),
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(["processing", "courier", "delivered", "cancelled"]).optional(),
  cancleReason: z.string().optional(),
  totalPrice: z.number().optional(),
  paymentMethod: z.enum(["cash", "card", "sslcommerz"]).optional(),
  address: addressValidation,
});

export const orderValidation = {
    createValidation
}