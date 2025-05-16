import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate";
import { authenticate, authorizeAdmin } from "../middlewares/auth";
import { cacheControl, etagMiddleware } from "../middlewares/cache";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = express.Router();

// Apply caching to GET routes - cache for 5 minutes
router.get("/", cacheControl(300), etagMiddleware(), getCategories);
router.get("/:id", cacheControl(300), etagMiddleware(), getCategory);

// Protected routes don't need caching
router.post(
  "/",
  [
    authenticate,
    authorizeAdmin,
    body("name").notEmpty().withMessage("Name is required"),
    body("color").notEmpty().withMessage("Color is required"),
  ],
  validateRequest,
  createCategory
);
router.put(
  "/:id",
  [
    authenticate,
    authorizeAdmin,
    body("name").optional().notEmpty(),
    body("color").optional().notEmpty(),
  ],
  validateRequest,
  updateCategory
);
router.delete("/:id", authenticate, authorizeAdmin, deleteCategory);

export default router;
