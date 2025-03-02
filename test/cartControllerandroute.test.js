const request = require("supertest");
const app = require("../../app"); // Import Express app
const { Cart, User, Product } = require("../../models");
const { generateToken } = require("../../utils/tokenUtils");

let userToken, userId, productId, cartItemId;

beforeAll(async () => {
  await User.sync({ force: true });
  await Product.sync({ force: true });
  await Cart.sync({ force: true });

  // Create a user
  const user = await User.create({ name: "John Doe", email: "johndoe@example.com", password: "password123" });
  userId = user.id;
  userToken = generateToken(user.id, "user");

  // Create a product
  const product = await Product.create({ name: "Laptop", description: "Gaming Laptop", price: 1500, stock: 10 });
  productId = product.id;
});

describe("Cart Controller Tests", () => {
  test(" User: Add item to cart", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ userId, productId, quantity: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body.cartItem).toHaveProperty("id");
    cartItemId = res.body.cartItem.id;
  });

  test(" User: Get cart items", async () => {
    const res = await request(app)
      .get(`/api/cart/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test(" User: Update cart item quantity", async () => {
    const res = await request(app)
      .put(`/api/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.cartItem.quantity).toBe(5);
  });

  test(" User: Remove an item from cart", async () => {
    const res = await request(app)
      .delete(`/api/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Cart item removed");
  });

  test(" User: Remove non-existing cart item", async () => {
    const res = await request(app)
      .delete(`/api/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Cart item not found");
  });
});

afterAll(async () => {
  await Cart.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Product.destroy({ where: {} });
});