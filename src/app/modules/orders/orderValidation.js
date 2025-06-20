import { z } from "zod";

const createValidation = z.object({
    productId : z.string(),
    userId : z.string(),
    quantity : z.number(),
    price : z.number(),
    
})

export const orderValidation = {
    createValidation
}