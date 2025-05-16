import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { generateToken, generateRefreshToken } from "../utils/jwt";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { Document, Types } from "mongoose";

interface IUserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *     responses:
 *       201: { description: User registered }
 *       400: { description: Bad request }
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const user = new User({ email, password, name }) as IUserDocument;
    await user.save();
    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    logger.info(`User registered: ${email}`);
    res.status(201).json({ token, refreshToken });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }) as IUserDocument | null;
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    logger.info(`User logged in: ${email}`);
    res.json({ token, refreshToken });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: New access token }
 *       401: { description: Invalid refresh token }
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };
    const user = await User.findById(decoded.userId) as IUserDocument | null;
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const token = generateToken(user._id.toString(), user.role);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Logged out successfully }
 *       401: { description: Unauthorized }
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user!.userId) as IUserDocument | null;
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    res.json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: User profile }
 *       401: { description: Unauthorized }
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user!.userId).select(
      "-password -refreshToken"
    ) as IUserDocument | null;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
