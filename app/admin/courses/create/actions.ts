"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";
import { stripe } from "@/lib/stripe";
import { ResponseObjectType } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import Stripe from "stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);
export async function CreateCourse(
  data: CourseSchemaType
): Promise<ResponseObjectType> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return {
          status: "error",
          message: "too many requests",
        };
      else {
        return {
          status: "error",
          message: "You have been blocked",
        };
      }
    }

    const validatedData = courseSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "invalid data",
      };
    }

    const product = await stripe.products.create({
      description: validatedData.data.smallDescription,
      name: validatedData.data.title,
      default_price_data: {
        currency: "usd",
        unit_amount: validatedData.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...validatedData.data,
        userId: session?.user.id as string,
        stripePriceId: product.default_price as string,
      },
    });

    return {
      status: "success",
      message: "course created successfully",
    };
  } catch (e) {
    // ✅ Handle specific known error types
    if (e instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: `Stripe error: ${e.message}`,
      };
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        status: "error",
        message: `Database error (${e.code}): ${e.message}`,
      };
    }

    return {
      status: "error",
      message: "error creating course",
    };
  }
}
