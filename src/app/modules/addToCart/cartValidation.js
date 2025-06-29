import { z } from "zod";

const createValidation = z.object({
    productId : z.string(),
    userId : z.string(),
})

export const cartValidation = {
    createValidation
}