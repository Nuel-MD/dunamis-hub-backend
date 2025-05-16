import mongoose from "mongoose";
import logger from "./utils/logger";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
