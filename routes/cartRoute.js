const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");


router.post("/", verifyToken, cartController.addToCart);
router.get("/:userId", verifyToken, cartController.getCartItems);
router.put("/:id", verifyToken, cartController.updateCartItem);
router.delete("/:id", verifyToken, cartController.removeFromCart);

module.exports = router;
