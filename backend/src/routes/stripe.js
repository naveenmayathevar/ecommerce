const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items required" });
    }

    const line_items = items.map((it) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: it.name,
          images: it.image ? [it.image] : undefined,
        },
        unit_amount: Math.round(Number(it.price) * 100),
      },
      quantity: Number(it.qty || 1),
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: customer?.email, // optional
      metadata: {
        fullName: customer?.fullName || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        zip: customer?.zip || "",
        notes: customer?.notes || "",
      },
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ message: "Stripe error" });
  }
});

module.exports = router;
