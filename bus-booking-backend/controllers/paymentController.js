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

// Create PaymentIntent
export const createPaymentIntent = async (req, res) => {
  try {
    const stripeInstance = initializeStripe();
    const { amount, currency = "usd" } = req.body;
    
    if (!amount) {
      return res.status(400).json({ msg: "Amount is required" });
    }

    const intent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      metadata: { integration_check: "accept_a_payment" }
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};