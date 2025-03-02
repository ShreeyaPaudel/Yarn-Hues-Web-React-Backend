const request = require("supertest");
const app = require("../../app"); // Import Express app
const { Order, User } = require("../../models");
const { generateToken } = require("../../utils/tokenUtils");

let userToken, adminToken, userId, orderId;

beforeAll(async () => {
  await User.sync({ force: true });
  await Order.sync({ force: true });

  // Create a user
  const user = await User.create({ name: "John Doe", email: "johndoe@example.com", password: "password123" });
  userId = user.id;
  userToken = generateToken(user.id, "user");
  adminToken = generateToken(1, "admin"); // Mock admin token
});

describe("Order Controller Tests", () => {
  test("User: Create a new order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ userId, totalAmount: 250, status: "pending", paymentMethod: "Credit Card" });

    expect(res.statusCode).toBe(201);
    expect(res.body.order).toHaveProperty("id");
    orderId = res.body.order.id;
  });

  test(" Admin: Get all orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test(" User: Get order by ID", async () => {
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", orderId);
  });

  test(" Admin: Update order status", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipped" });

    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe("shipped");
  });

  test(" Admin: Delete an order", async () => {
    const res = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Order deleted successfully");
  });

  test(" Admin: Delete non-existing order", async () => {
    const res = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Order not found");
  });
});

afterAll(async () => {
  await Order.destroy({ where: {} });
  await User.destroy({ where: {} });
});
