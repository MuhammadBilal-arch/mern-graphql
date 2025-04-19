import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error("❌ STRIPE_SECRET_KEY is not defined in your environment variables.");
}
const stripe = new Stripe(stripeSecret, {
  typescript: true,
});

export default stripe;
