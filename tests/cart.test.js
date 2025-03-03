const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();

// Mock User Model
const UserMock = dbMock.define("User", {
  id: 1,
  name: "John Doe",
  email: "johndoe@example.com",
});

// Mock Product Model
const ProductMock = dbMock.define("Product", {
  id: 1,
  name: "Sample Product",
  price: 99.99,
});


const CartMock = dbMock.define("Cart", {
  id: 1,
  userId: 1,
  productId: 1,
  quantity: 2,
});

// Associate Cart with User and Product
CartMock.belongsTo(UserMock, { foreignKey: "userId" });
CartMock.belongsTo(ProductMock, { foreignKey: "productId" });

describe("Cart Model", () => {
  it("should create a cart item with valid details", async () => {
    const cartItem = await CartMock.create({
      userId: 1,
      productId: 1,
      quantity: 3,
    });

    expect(cartItem.userId).toBe(1);
    expect(cartItem.productId).toBe(1);
    expect(cartItem.quantity).toBe(3);
  });

  it("should require userId, productId, and quantity", async () => {
    await expect(CartMock.create({})).rejects.toThrow();
  });

  it("should enforce default quantity as 1", async () => {
    const cartItem = await CartMock.create({
      userId: 2,
      productId: 2,
    });

    expect(cartItem.quantity).toBe(1);
  });


});
