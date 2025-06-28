import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { userValidation } from "./userValidation.js";
import { userService } from "./user.service.js";
const router = Router();

router.post('/',validationMiddleware(userValidation.createValidation),userService.addUser)

router.get('/', userService.getAllUsers)
router.get('login/:email', userService.getUserWithEmail)
router.delete('/:id', userService.deleteUser)
router.patch('/:id', userService.updateUser)
router.patch('/makeAdmin/:id', userService.makeAdminById)

export const userRoute = router