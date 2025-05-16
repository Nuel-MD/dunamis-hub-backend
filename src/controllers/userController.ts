import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import logger from "../utils/logger";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of users }
 *       403: { description: Admin access required }
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User details }
 *       404: { description: User not found }
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string }
 *     responses:
 *       200: { description: User updated }
 *       404: { description: User not found }
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.role) {
      user.role = req.body.role;
      await user.save();
      logger.info(`User role updated: ${user.email}`);
    }

    res.json({ message: "User updated", user });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User deleted }
 *       404: { description: User not found }
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    logger.info(`User deleted: ${user.email}`);
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile/update:
 *   put:
 *     summary: Update own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Profile updated }
 *       404: { description: User not found }
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;

    await user.save();
    logger.info(`Profile updated: ${user.email}`);

    const userResponse = user.toObject();
    const { password, refreshToken, ...userWithoutSensitiveData } =
      userResponse;

    res.json({ message: "Profile updated", user: userWithoutSensitiveData });
  } catch (error) {
    next(error);
  }
};
