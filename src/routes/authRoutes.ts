import express, { RequestHandler } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/authController";
import { authenticate } from "../middlewares/auth";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  validateRequest as RequestHandler,
  register as RequestHandler
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest as RequestHandler,
  login as RequestHandler
);

router.post("/refresh", refresh as RequestHandler);
router.post("/logout", authenticate as RequestHandler, logout as RequestHandler);
router.get("/me", authenticate as RequestHandler, getMe as RequestHandler);

export default router;
