import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { admin, emailOTP } from "better-auth/plugins";

import { env } from "./env";
import { resend } from "./resend";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await resend.emails.send({
          from: "LSM-PLATFORM <onboarding@resend.dev>",
          to: [email],
          subject: "LSM_PLATFORM - VERIFY YOUR EMAIL",
          html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });
      },
    }),

    admin(),
  ],
});
