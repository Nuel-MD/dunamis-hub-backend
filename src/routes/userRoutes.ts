import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate";
import { authenticate, authorizeAdmin } from "../middlewares/auth";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
} from "../controllers/userController";

const router = express.Router();

router.get("/", authenticate, authorizeAdmin, getUsers);
router.get("/:id", authenticate, authorizeAdmin, getUser);
router.put(
  "/:id",
  [
    authenticate,
    authorizeAdmin,
    body("role").optional().isIn(["user", "admin"]),
  ],
  validateRequest,
  updateUser
);
router.delete("/:id", authenticate, authorizeAdmin, deleteUser);

router.put(
  "/profile/update",
  [
    authenticate,
    body("name").optional().notEmpty(),
    body("email").optional().isEmail(),
    body("password").optional().isLength({ min: 6 }),
  ],
  validateRequest,
  updateProfile
);

export default router;
