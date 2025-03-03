const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();

const ProductMock = dbMock.define("Product", {
  id: 1,
  name: "Sample Product",
  description: "This is a sample product description.",
  price: 99.99,
  stock: 10,
  category: "Electronics",
  imageUrl: "http://example.com/sample.jpg",
});

describe("Product Model", () => {
  it("should create a product with valid details", async () => {
    const product = await ProductMock.create({
      name: "Test Product",
      description: "A test product description.",
      price: 49.99,
      stock: 5,
      category: "Clothing",
      imageUrl: "http://example.com/test.jpg",
    });

    expect(product.name).toBe("Test Product");
    expect(product.description).toBe("A test product description.");
    expect(product.price).toBe(49.99);
    expect(product.stock).toBe(5);
    expect(product.category).toBe("Clothing");
    expect(product.imageUrl).toBe("http://example.com/test.jpg");
  });

  it("should require a name, price, stock, and category", async () => {
    await expect(ProductMock.create({})).rejects.toThrow();
  });

  it("should enforce stock default value to be 0", async () => {
    const product = await ProductMock.create({
      name: "Default Stock Product",
      price: 20.99,
      category: "Books",
    });

    expect(product.stock).toBe(0); 
  });

});
