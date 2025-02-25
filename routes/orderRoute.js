const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Customers can place orders
router.post("/", verifyToken, orderController.createOrder);

// Admins can view all orders
router.get("/", verifyAdmin, orderController.getAllOrders);

// Customers and admins can view their orders
router.get("/:id", verifyToken, orderController.getOrderById);

// Admins can update order status
router.put("/:id", verifyAdmin, orderController.updateOrderStatus);

// Admins can delete orders
router.delete("/:id", verifyAdmin, orderController.deleteOrder);

module.exports = router;
