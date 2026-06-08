const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const { addOrder, getMyOrders, getAllOrders } = require("../controllers/orderController");

// Create order
router.post("/", protect, addOrder);

// Get my orders
router.get("/myorders", protect, getMyOrders);

// Admin - get all orders
router.get("/", protect, admin, getAllOrders);

module.exports = router;
