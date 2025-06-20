import { z } from "zod";
import { optional } from "zod/v4";

const createValidation = z.object({
    name : z.string(),
    email : z.string(),
    role : z.string().optional()
})

export const userValidation = {
    createValidation
}