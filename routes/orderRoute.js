const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");


router.post("/", verifyToken, orderController.createOrder);


router.get("/", verifyAdmin, orderController.getAllOrders);


router.get("/:id", verifyToken, orderController.getOrderById);

router.put("/:id", verifyAdmin, orderController.updateOrderStatus);

router.delete("/:id", verifyAdmin, orderController.deleteOrder);

module.exports = router;
