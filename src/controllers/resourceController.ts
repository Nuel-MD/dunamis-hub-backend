import { Request, Response, NextFunction } from "express";
import Resource from "../models/Resource";
import logger from "../utils/logger";

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: List all resources
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of resources }
 */
export const getResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sort = "createdAt",
      order = "desc",
    } = req.query;
    const query: any = category ? { category } : {};
    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: { [sort as string]: order === "desc" ? -1 : 1 },
      populate: { path: "authorId", select: "name" },
    };
    const resources = await Resource.paginate(query, options);
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/resources/{id}:
 *   get:
 *     summary: Get a resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Resource details }
 *       404: { description: Resource not found }
 */
export const getResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate("authorId", "name");
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - imageUrl
 *               - externalLink
 *               - category
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               imageUrl: { type: string }
 *               externalLink: { type: string }
 *               category: { type: string }
 *               featured: { type: boolean }
 *     responses:
 *       201: { description: Resource created }
 *       400: { description: Invalid input }
 */
export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = new Resource({
      ...req.body,
      authorId: req.user!.userId,
    });
    await resource.save();
    logger.info(`Resource created: ${resource.title}`);
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/resources/{id}:
 *   put:
 *     summary: Update a resource
 *     tags: [Resources]
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
 *               title: { type: string }
 *               description: { type: string }
 *               imageUrl: { type: string }
 *               externalLink: { type: string }
 *               category: { type: string }
 *               featured: { type: boolean }
 *     responses:
 *       200: { description: Resource updated }
 *       404: { description: Resource not found }
 */
export const updateResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });

    Object.assign(resource, req.body);
    await resource.save();
    logger.info(`Resource updated: ${resource.title}`);
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Resource deleted }
 *       404: { description: Resource not found }
 */
export const deleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });
    logger.info(`Resource deleted: ${resource.title}`);
    res.json({ message: "Resource deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/resources/featured:
 *   get:
 *     summary: Get featured resources
 *     tags: [Resources]
 *     responses:
 *       200: { description: List of featured resources }
 */
export const getFeaturedResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resources = await Resource.find({ featured: true })
      .populate("authorId", "name")
      .sort("-createdAt")
      .limit(10);
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/resources/category/{category}:
 *   get:
 *     summary: Get resources by category
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of resources in category }
 */
export const getResourcesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: { createdAt: -1 },
      populate: { path: "authorId", select: "name" },
    };
    const resources = await Resource.paginate(
      { category: req.params.category },
      options
    );
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/resources/search:
 *   get:
 *     summary: Search resources
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Search results }
 */
export const searchResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query required" });
    const resources = await Resource.find(
      { $text: { $search: q as string } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("authorId", "name");
    res.json(resources);
  } catch (error) {
    next(error);
  }
};
