import express, { RequestHandler } from "express";
import {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  getFeaturedResources,
  getResourcesByCategory,
  searchResources,
} from "../controllers/resourceController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate";

const router = express.Router();

// Public routes
router.get("/", getResources as RequestHandler);
router.get("/featured", getFeaturedResources as RequestHandler);
router.get("/category/:category", getResourcesByCategory as RequestHandler);
router.get("/search", searchResources as RequestHandler);
router.get("/:id", getResource as RequestHandler);

// Protected routes
router.post(
  "/",
  [
    authenticate as RequestHandler,
    authorizeAdmin as RequestHandler,
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("imageUrl").isURL(),
    body("externalLink").isURL(),
    body("category").isIn(["sermon", "worship", "book", "movie"]),
    validateRequest as RequestHandler
  ],
  createResource as RequestHandler
);

router.put(
  "/:id", 
  [authenticate as RequestHandler, authorizeAdmin as RequestHandler], 
  updateResource as RequestHandler
);

router.delete(
  "/:id", 
  [authenticate as RequestHandler, authorizeAdmin as RequestHandler], 
  deleteResource as RequestHandler
);

export default router;
