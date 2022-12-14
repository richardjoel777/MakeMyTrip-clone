export default {
  stripePublicKey:
    process.env.STRIPE_PUBLIC_KEY,
  stripeSecretKey:
    process.env.STRIPE_SECRET_KEY,
  stripeWebHookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};
