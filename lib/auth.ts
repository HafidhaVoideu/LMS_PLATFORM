import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { prisma } from "./db";
import { admin, emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },

  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "LSM-PLATFORM <onboarding@resend.dev>",
          to: [email],
          subject: "LSM_PLATFORM - VERIFY YOUR EMAIL",
          html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],

  hooks: {
    after: createAuthMiddleware(async (ctx: any) => {
      // ctx.path gives the route, e.g. /sign-up, /sign-in, etc.
      const newSession = ctx.context.newSession;
      if (newSession?.user) {
        try {
          await prisma.user.update({
            where: { id: newSession.user.id },
            data: { role: "admin" },
          });
        } catch (err) {}
      }
    }),
  },
});
