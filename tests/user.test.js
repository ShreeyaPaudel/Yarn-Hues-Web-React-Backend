const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();

const UserMock = dbMock.define("User", {
  id: 1,
  name: "John Doe",
  email: "johndoe@example.com",
  password: "hashedpassword",
  role: "customer",
  address: "123 Main St",
  phone: "1234567890",
});

describe("User Model", () => {
  it("should create a user with valid details", async () => {
    const user = await UserMock.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "securepassword",
      role: "admin",
      address: "456 Elm St",
      phone: "9876543210",
    });//

    expect(user.name).toBe("Jane Doe");
    expect(user.email).toBe("janedoe@example.com");
    expect(user.password).toBe("securepassword");
    expect(user.role).toBe("admin");
    expect(user.address).toBe("456 Elm St");
    expect(user.phone).toBe("9876543210");
  });////////


});
