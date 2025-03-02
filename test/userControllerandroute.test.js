const request = require("supertest");
const app = require("../../app"); // Import Express app
const { User } = require("../../models");
const { generateToken } = require("../../utils/tokenUtils");
const bcrypt = require("bcryptjs");

let adminToken, userToken, userId;

beforeAll(async () => {
  await User.sync({ force: true }); // Reset database before tests

  // Create an admin user
  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: await bcrypt.hash("password123", 10),
    role: "admin",
  });
  adminToken = generateToken(admin.id, "admin");
});

describe("User Controller Tests", () => {
  test(" Register a new user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        role: "customer",
        address: "123 Street",
        phone: "1234567890",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    userId = res.body.user.id;
  });

  test(" Prevent duplicate user registration", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already registered");
  });

  test("User login", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "johndoe@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    userToken = res.body.token;
  });

  test("Admin: Get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test(" Get user by ID", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
  });

  test(" Update user", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated John Doe" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe("Updated John Doe");
  });

  test("Delete user", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });

  test(" Delete non-existing user", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});

afterAll(async () => {
  await User.destroy({ where: {} });
});
