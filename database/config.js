const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false, // Set to true to see raw SQL queries
});

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log("PostgreSQL connected successfully............................................................."))
  .catch(err => console.error("Database connection error:", err));




module.exports = sequelize;