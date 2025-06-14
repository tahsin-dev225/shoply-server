import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { userValidation } from "./userValidation.js";
import { userService } from "./user.service.js";
const router = Router();

router.post('/',validationMiddleware(userValidation.createValidation),userService.addUser)

router.get('/:email', userService.getUserWithEmail)

export const userRoute = router