const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItemQty,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// All cart routes are protected
router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:productId", protect, updateCartItemQty);
router.delete("/:productId", protect, removeCartItem);

module.exports = router;
