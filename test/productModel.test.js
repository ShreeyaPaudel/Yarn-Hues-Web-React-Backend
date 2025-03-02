const { Product } = require("../../models");
const { sequelize } = require("../../models");

describe("Product Model Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database before tests
  });

  test("Should create a product with valid details", async () => {
    const product = await Product.create({
      name: "Gaming Laptop",
      description: "High-performance gaming laptop",
      price: 1500.99,
      stock: 20,
      category: "Electronics",
      imageUrl: "http://example.com/laptop.jpg",
    });

    expect(product).toBeDefined();
    expect(product.name).toBe("Gaming Laptop");
    expect(product.price).toBe(1500.99);
    expect(product.stock).toBe(20);
    expect(product.category).toBe("Electronics");
  });

  test(" Should not create a product without a name", async () => {
    try {
      await Product.create({
        description: "Missing name field",
        price: 999.99,
        stock: 10,
        category: "Electronics",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeValidationError");
    }
  });

  test("Should not create a product without a category", async () => {
    try {
      await Product.create({
        name: "Smartphone",
        description: "Latest smartphone model",
        price: 799.99,
        stock: 50,
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeValidationError");
    }
  });

  test(" Should default stock to 0 if not provided", async () => {
    const product = await Product.create({
      name: "Wireless Earbuds",
      description: "Noise-canceling wireless earbuds",
      price: 199.99,
      category: "Electronics",
    });

    expect(product.stock).toBe(0); // Default value should be 0
  });

  afterAll(async () => {
    await sequelize.close(); // Close DB connection after tests
  });
});
