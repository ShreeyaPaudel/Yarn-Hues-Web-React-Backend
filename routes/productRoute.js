const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Protect admin routes (only admins can manage products)
router.post("/", verifyAdmin, upload.single("image"), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", verifyAdmin, upload.single("image"), productController.updateProduct);
router.delete("/:id", verifyAdmin, productController.deleteProduct);

module.exports = router;
