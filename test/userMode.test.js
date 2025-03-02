const { User } = require("../../models");
const { sequelize } = require("../../models");

describe("User Model Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database
  });

  test(" Should create a user with valid details", async () => {
    const user = await User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "securepassword",
      role: "customer",
      address: "123 Main Street",
      phone: "1234567890",
    });

    expect(user).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("johndoe@example.com");
    expect(user.role).toBe("customer");
  });

  test(" Should not allow duplicate emails", async () => {
    try {
      await User.create({
        name: "Jane Doe",
        email: "johndoe@example.com", // Duplicate email
        password: "anotherpassword",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeUniqueConstraintError");
    }
  });

  test("Should not create a user with invalid email format", async () => {
    try {
      await User.create({
        name: "Invalid User",
        email: "invalid-email",
        password: "password123",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeValidationError");
    }
  });

  test("Should not create a user with a non-numeric phone number", async () => {
    try {
      await User.create({
        name: "Phone Test",
        email: "phone@example.com",
        password: "password123",
        phone: "not-a-number",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeValidationError");
    }
  });

  afterAll(async () => {
    await sequelize.close(); // Close DB connection after tests
  });
});
