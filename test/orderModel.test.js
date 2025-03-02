const { Order, User } = require("../../models");
const { sequelize } = require("../../models");

describe("Order Model Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database before tests
  });

  test(" Should create an order with valid details", async () => {
    const user = await User.create({ name: "John Doe", email: "johndoe@example.com", password: "password123" });

    const order = await Order.create({
      userId: user.id,
      totalAmount: 250.75,
      status: "pending",
      paymentMethod: "Credit Card",
    });

    expect(order).toBeDefined();
    expect(order.userId).toBe(user.id);
    expect(order.totalAmount).toBe(250.75);
    expect(order.status).toBe("pending");
    expect(order.paymentMethod).toBe("Credit Card");
  });

  test(" Should not create an order without a userId", async () => {
    try {
      await Order.create({
        totalAmount: 99.99,
        status: "shipped",
        paymentMethod: "PayPal",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeForeignKeyConstraintError");
    }
  });

  test(" Should not create an order without a payment method", async () => {
    try {
      const user = await User.create({ name: "Jane Doe", email: "janedoe@example.com", password: "password123" });
      await Order.create({
        userId: user.id,
        totalAmount: 150.5,
        status: "delivered",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeValidationError");
    }
  });

  test("Should default status to 'pending' if not provided", async () => {
    const user = await User.create({ name: "Alice Doe", email: "alice@example.com", password: "password123" });

    const order = await Order.create({
      userId: user.id,
      totalAmount: 300.0,
      paymentMethod: "Debit Card",
    });

    expect(order.status).toBe("pending");
  });

  afterAll(async () => {
    await sequelize.close(); // Close DB connection after tests
  });
});