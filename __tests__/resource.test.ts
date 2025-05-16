import request from "supertest";
import app from "../src/index";
import Resource from "../src/models/Resource";
import User from "../src/models/User";
import mongoose from "mongoose";

describe("Resource API", () => {
  let adminToken: string;
  let adminId: string;

  beforeEach(async () => {
    const admin = await User.create({
      email: "admin@test.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    });
    adminId = admin._id.toString();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123",
    });
    adminToken = loginRes.body.token;
  });

  it("should create a resource", async () => {
    const res = await request(app)
      .post("/api/resources")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Resource",
        description: "Test Description",
        imageUrl: "https://example.com/image.jpg",
        externalLink: "https://example.com/resource",
        category: "sermon",
        featured: true,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Test Resource");
    expect(res.body).toHaveProperty("authorId", adminId);
  });

  it("should get all resources", async () => {
    await Resource.create({
      title: "Test Resource 1",
      description: "Description 1",
      imageUrl: "https://example.com/1.jpg",
      externalLink: "https://example.com/1",
      category: "sermon",
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    await Resource.create({
      title: "Test Resource 2",
      description: "Description 2",
      imageUrl: "https://example.com/2.jpg",
      externalLink: "https://example.com/2",
      category: "worship",
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    const res = await request(app).get("/api/resources");

    expect(res.status).toBe(200);
    expect(res.body.docs).toHaveLength(2);
    expect(res.body).toHaveProperty("totalDocs", 2);
  });

  it("should get featured resources", async () => {
    await Resource.create({
      title: "Featured Resource",
      description: "Description",
      imageUrl: "https://example.com/featured.jpg",
      externalLink: "https://example.com/featured",
      category: "sermon",
      featured: true,
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    await Resource.create({
      title: "Non-Featured Resource",
      description: "Description",
      imageUrl: "https://example.com/non-featured.jpg",
      externalLink: "https://example.com/non-featured",
      category: "sermon",
      featured: false,
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    const res = await request(app).get("/api/resources/featured");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("title", "Featured Resource");
  });

  it("should get resources by category", async () => {
    await Resource.create({
      title: "Sermon Resource",
      description: "Description",
      imageUrl: "https://example.com/sermon.jpg",
      externalLink: "https://example.com/sermon",
      category: "sermon",
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    await Resource.create({
      title: "Worship Resource",
      description: "Description",
      imageUrl: "https://example.com/worship.jpg",
      externalLink: "https://example.com/worship",
      category: "worship",
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    const res = await request(app).get("/api/resources/category/sermon");

    expect(res.status).toBe(200);
    expect(res.body.docs).toHaveLength(1);
    expect(res.body.docs[0]).toHaveProperty("title", "Sermon Resource");
  });

  it("should search resources", async () => {
    await Resource.create({
      title: "Faith Message",
      description: "A message about faith",
      imageUrl: "https://example.com/faith.jpg",
      externalLink: "https://example.com/faith",
      category: "sermon",
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    await Resource.create({
      title: "Hope Message",
      description: "A message about hope",
      imageUrl: "https://example.com/hope.jpg",
      externalLink: "https://example.com/hope",
      category: "sermon",
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    const res = await request(app).get("/api/resources/search?q=faith");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("title", "Faith Message");
  });

  it("should update a resource", async () => {
    const resource = await Resource.create({
      title: "Original Title",
      description: "Original Description",
      imageUrl: "https://example.com/original.jpg",
      externalLink: "https://example.com/original",
      category: "sermon",
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    const res = await request(app)
      .put(`/api/resources/${resource._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Updated Title",
        description: "Updated Description",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Updated Title");
    expect(res.body).toHaveProperty("description", "Updated Description");
  });

  it("should delete a resource", async () => {
    const resource = await Resource.create({
      title: "Resource to Delete",
      description: "Description",
      imageUrl: "https://example.com/delete.jpg",
      externalLink: "https://example.com/delete",
      category: "sermon",
      authorId: new mongoose.Types.ObjectId(adminId),
    });

    const res = await request(app)
      .delete(`/api/resources/${resource._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Resource deleted");

    const deletedResource = await Resource.findById(resource._id);
    expect(deletedResource).toBeNull();
  });
});
