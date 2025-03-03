const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const User = require("./User");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },///
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
    allowNull: false,
    defaultValue: "pending",
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},{
    tableName: 'orders'
  });

// Define associations
Order.belongsTo(User, { foreignKey: "userId" });

module.exports = Order;
///
