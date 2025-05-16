import mongoose from "mongoose";
import User from "./models/User";
import Resource from "./models/Resource";
import Category from "./models/Category";
import { config } from "dotenv";

config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Category.deleteMany({});

    // Create admin user
    const admin = new User({
      email: "eimuogbo@gmail.com",
      password: "eimuogbo2025@",
      name: "Admin",
      role: "admin",
    });
    await admin.save();

    // Create categories
    const categories = [
      { name: "Sermons", slug: "sermons", color: "#ff0000" },
      { name: "Worship", slug: "worship", color: "#00ff00" },
      { name: "Books", slug: "books", color: "#0000ff" },
      { name: "Movies", slug: "movies", color: "#ffff00" },
    ];
    await Category.insertMany(categories);

    // Create sample resources
    const resources = [
      {
        title: "Sample Sermon",
        description: "A powerful message about faith",
        imageUrl: "https://example.com/sermon.jpg",
        externalLink: "https://example.com/sermon",
        category: "sermon",
        featured: true,
        authorId: admin._id,
      },
      {
        title: "Worship Experience",
        description: "A collection of worship songs",
        imageUrl: "https://example.com/worship.jpg",
        externalLink: "https://example.com/worship",
        category: "worship",
        featured: true,
        authorId: admin._id,
      },
    ];
    await Resource.insertMany(resources);

    console.log("✅ Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
