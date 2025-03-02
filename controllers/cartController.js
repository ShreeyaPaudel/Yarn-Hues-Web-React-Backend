    const Cart = require("../models/Cart");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cartItem = await Cart.create({ userId, productId, quantity });

    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get cart items for a user
const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await Cart.findAll({ where: { userId } });

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    await cartItem.update({ quantity });

    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    await cartItem.destroy();
    res.status(200).json({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {removeFromCart, updateCartItem, getCartItems, addToCart}
