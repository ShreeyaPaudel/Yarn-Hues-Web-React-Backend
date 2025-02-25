const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
// User Routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);


// Protect these routes: Only authenticated users can access
router.get("/", verifyAdmin, userController.getAllUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyAdmin, userController.deleteUser);

module.exports = router;
