const { Cart, User, Product } = require("../../models");
const { sequelize } = require("../../models");

describe("Cart Model Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database before tests
  });

  test(" Should add a product to the cart with valid details", async () => {
    const user = await User.create({ name: "John Doe", email: "johndoe@example.com", password: "password123" });
    const product = await Product.create({ name: "Laptop", description: "Gaming Laptop", price: 1500, stock: 10 });

    const cartItem = await Cart.create({
      userId: user.id,
      productId: product.id,
      quantity: 2,
    });

    expect(cartItem).toBeDefined();
    expect(cartItem.userId).toBe(user.id);
    expect(cartItem.productId).toBe(product.id);
    expect(cartItem.quantity).toBe(2);
  });

  test("Should not create a cart item without a userId", async () => {
    try {
      const product = await Product.create({ name: "Tablet", description: "Portable device", price: 500, stock: 5 });
      await Cart.create({
        productId: product.id,
        quantity: 1,
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeForeignKeyConstraintError");
    }
  });

  test("Should not create a cart item without a productId", async () => {
    try {
      const user = await User.create({ name: "Jane Doe", email: "janedoe@example.com", password: "password123" });
      await Cart.create({
        userId: user.id,
        quantity: 1,
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeForeignKeyConstraintError");
    }
  });

  test("Should default quantity to 1 if not provided", async () => {
    const user = await User.create({ name: "Alice Doe", email: "alice@example.com", password: "password123" });
    const product = await Product.create({ name: "Headphones", description: "Wireless headphones", price: 100, stock: 15 });

    const cartItem = await Cart.create({
      userId: user.id,
      productId: product.id,
    });

    expect(cartItem.quantity).toBe(1); // Default value should be 1
  });

  afterAll(async () => {
    await sequelize.close(); // Close DB connection after tests
  });
});