import { z } from "zod";

const createValidation = z.object({
    name : z.string(),
    email : z.string(),
    price : z.number(),
    
})

export const productValidation = {
    createValidation
}