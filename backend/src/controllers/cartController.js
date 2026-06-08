const Cart = require("../models/cart");

// @desc   Get logged-in user's cart
// @route  GET /api/cart
// @access Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.json({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc   Add or update cart item
// @route  POST /api/cart
// @access Private
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, qty }],
      });
      await cart.save();
      const populated = await Cart.findOne({ user: req.user._id }).populate("items.product");
      return res.status(201).json(populated);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex !== -1) {
      cart.items[itemIndex].qty = qty;
    } else {
      cart.items.push({ product: productId, qty });
    }

    await cart.save();
    const populated = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(populated);
  } catch (error) {
    console.error("Add To Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc   Update qty for a single cart item
// @route  PUT /api/cart/:productId
// @access Private
const updateCartItemQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;

    const q = Number(qty);
    if (!q || q < 1) return res.status(400).json({ message: "Qty must be >= 1" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.qty = q;
    await cart.save();

    const updated = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(updated);
  } catch (error) {
    console.error("Update qty error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/:productId
// @access Private
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const populated = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(populated || { user: req.user._id, items: [] });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQty,
  removeCartItem,
};
