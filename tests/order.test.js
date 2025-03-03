const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();

// Mock User Model
const UserMock = dbMock.define("User", {
  id: 1,
  name: "John Doe",
  email: "johndoe@example.com",
  password: "hashedpassword",
});


const OrderMock = dbMock.define("Order", {
  id: 1,
  userId: 1,
  totalAmount: 100.5,
  status: "pending",
  paymentMethod: "Credit Card",
});


OrderMock.belongsTo(UserMock, { foreignKey: "userId" });

describe("Order Model", () => {
  it("should create an order with valid details", async () => {
    const order = await OrderMock.create({
      userId: 1,
      totalAmount: 250.75,
      status: "shipped",
      paymentMethod: "PayPal",
    });

    expect(order.userId).toBe(1);
    expect(order.totalAmount).toBe(250.75);
    expect(order.status).toBe("shipped");
    expect(order.paymentMethod).toBe("PayPal");
  });

  it("should require userId, totalAmount, status, and paymentMethod", async () => {
    await expect(OrderMock.create({})).rejects.toThrow();
  });

  it("should default status to 'pending'", async () => {
    const order = await OrderMock.create({
      userId: 2,
      totalAmount: 50.99,
      paymentMethod: "Bank Transfer",
    });

    expect(order.status).toBe("pending");
  });

});
