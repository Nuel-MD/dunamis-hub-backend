import jwt from "jsonwebtoken";

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

export { generateToken, generateRefreshToken };
