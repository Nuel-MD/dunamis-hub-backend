import { Request, Response, NextFunction } from "express";
import etag from "etag";

// Middleware to set Cache-Control headers
export const cacheControl = (seconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only apply caching to GET requests
    if (req.method === "GET") {
      res.setHeader("Cache-Control", `public, max-age=${seconds}`);
    } else {
      // Ensure non-GET requests are not cached
      res.setHeader("Cache-Control", "no-store");
    }
    next();
  };
};

// Middleware to handle ETag generation and validation
export const etagMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Store the original res.json method
    const originalJson = res.json;

    // Override res.json to generate ETag based on response body
    res.json = function (body: any) {
      // Generate ETag from response body
      const generatedEtag = etag(JSON.stringify(body));

      // Set ETag header
      res.setHeader("ETag", generatedEtag);

      // Check if client sent matching ETag in If-None-Match header
      const clientEtag = req.get("If-None-Match");
      if (clientEtag && clientEtag === generatedEtag) {
        // If ETags match, return 304 Not Modified
        res.status(304).end();
        return res;
      }

      // Call original res.json to send response
      originalJson.call(this, body);
      return res;
    };

    next();
  };
};