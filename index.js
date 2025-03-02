const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const sequelize = require("./database/config"); // ✅ Ensure correct import
// const User = require("./models/User"); // ✅ Import User model

const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const orderRoutes = require("./routes/orderRoute");
const cartRoutes = require("./routes/cartRoute")

const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const User = require("./models/User"); // Import User model

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

//Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files from "uploads" folder
app.use("/uploads", express.static("uploads"));

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to Yarn_Hues API");
});
//Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);


// Sync models before starting the server
sequelize.sync({ alter: true }) // Automatically creates tables if they don't exist
  .then(() => console.log("Database synchronized........................................................................."))
  .catch(err => console.error("Model sync error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...................................................................`);
});

