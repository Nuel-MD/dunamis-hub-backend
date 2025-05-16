import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IUserPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as IUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Access denied" });
  next();
};
