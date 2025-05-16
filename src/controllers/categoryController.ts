import { Request, Response, NextFunction } from "express";
import Category from "../models/Category";
import logger from "../utils/logger";

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     responses:
 *       200: { description: List of categories }
 */
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category details }
 *       404: { description: Category not found }
 */
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *             properties:
 *               name: { type: string }
 *               color: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Category created }
 *       400: { description: Invalid input }
 */
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = new Category(req.body);
    await category.save();
    logger.info(`Category created: ${category.name}`);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
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
 *               name: { type: string }
 *               color: { type: string }
 *               description: { type: string }
 *     responses:
 *       200: { description: Category updated }
 *       404: { description: Category not found }
 */
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    Object.assign(category, req.body);
    await category.save();
    logger.info(`Category updated: ${category.name}`);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category deleted }
 *       404: { description: Category not found }
 */
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    logger.info(`Category deleted: ${category.name}`);
    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};
