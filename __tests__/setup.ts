import mongoose from "mongoose";
import { config } from "dotenv";

config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
