import Stripe from "stripe";

let stripe;

const initializeStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

export const createPaymentIntent = async (req, res) => {
  try {
    const stripeInstance = initializeStripe();
    const { amount, currency = "usd" } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Valid amount is required" });
    }

    const intent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency,
      metadata: { integration_check: "accept_a_payment" }
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ msg: err.message || "Payment initialization failed" });
  }
};