const request = require("supertest");
const app = require("../../app"); // Import Express app
const { Product } = require("../../models");
const { generateToken } = require("../../utils/tokenUtils");

let adminToken, productId;

beforeAll(async () => {
  await Product.sync({ force: true }); // Reset database before tests
  adminToken = generateToken(1, "admin"); // Mock admin token
});

describe("Product Controller Tests", () => {
  test("Admin: Create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gaming Laptop",
        description: "High-performance gaming laptop",
        price: 1500.99,
        stock: 20,
        category: "Electronics",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.product).toHaveProperty("id");
    productId = res.body.product.id;
  });

  test("Public: Get all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Public: Get a product by ID", async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", productId);
  });

  test("Admin: Update a product", async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Gaming Laptop", price: 1600.99 });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.name).toBe("Updated Gaming Laptop");
  });

  test(" Admin: Delete a product", async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product deleted successfully");
  });

  test("Admin: Delete a non-existing product", async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });
});

afterAll(async () => {
  await Product.destroy({ where: {} });
});
