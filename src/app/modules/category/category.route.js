import { Router } from "express";
import validationMiddleware from "../../helper/validateJod.js";
import { categoryService } from "./category.service.js";
const router = Router();

router.post("/", categoryService.addCategory);

router.get("/", categoryService.getAllCategory);

router.patch("/:id", categoryService.updateCategory);

export const categoryRoute = router;
