import Stripe from "stripe";

import { env } from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
  typescript: true,
  appInfo: {
    name: "Ignite Shop",
    version: "0.1.0",
  },
});
