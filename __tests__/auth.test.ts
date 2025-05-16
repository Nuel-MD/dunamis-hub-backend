import request from "supertest";
import app from "../src/index";
import User from "../src/models/User";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should not register a user with existing email", async () => {
    await User.create({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should login an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should not login with invalid credentials", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should get current user profile", async () => {
    const register = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${register.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "test@example.com");
    expect(res.body).toHaveProperty("name", "Test User");
    expect(res.body).not.toHaveProperty("password");
  });

  it("should refresh token", async () => {
    const register = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: register.body.refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should logout user", async () => {
    const register = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${register.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Logged out");

    const user = await User.findOne({ email: "test@example.com" });
    expect(user?.refreshToken).toBeUndefined();
  });
});
