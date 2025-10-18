"use server";
import { requireUser } from "@/app/data/user/user-session";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ResponseObjectType } from "@/lib/types";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);
export async function enrollInCourseAction(
  courseId: string
): Promise<ResponseObjectType | never> {
  const user = await requireUser();

  let checkoutUrl: string;
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied())
      return {
        status: "error",
        message: "You have been blocked",
      };

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },

      select: {
        id: true,
        slug: true,
        title: true,
        price: true,
      },
    });

    if (!course)
      return {
        status: "error",
        message: "course not found",
      };

    let stripeId: string;
    const userWithCustomerStripeId = await prisma.user.findUnique({
      where: {
        id: user.id,
      },

      select: {
        stripeCustomerId: true,
      },
    });

    if (userWithCustomerStripeId?.stripeCustomerId) {
      stripeId = userWithCustomerStripeId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      stripeId = customer.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: stripeId,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrolment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },

        select: {
          status: true,
          id: true,
        },
      });

      if (existingEnrollment?.status == "Active")
        return {
          status: "success",
          message: "You are already enrolled in this course",
        };

      let enrolment;

      if (existingEnrollment) {
        enrolment = await tx.enrolment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        enrolment = await tx.enrolment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "Pending",
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeId,

        line_items: [
          {
            price: "price_1SJMfBGB0No3Uqr50FpeM7rC",
            //  price_data: {
            //    currency: "usd",
            //    product_data: {
            //      name: course.title,
            //    },
            //    unit_amount: course.price * 100,
            //  },
            quantity: 1,
          },
        ],

        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrolmentId: enrolment.id,
        },
      });

      return {
        enrolement: enrolment,
        checkoutSession,
        checkoutUrl: checkoutSession.url,
      };
    });

    checkoutUrl = result.checkoutUrl as string;

    // return {
    //   status: "success",
    //   message: "Stripe customer created successfully",
    // };
  } catch (e) {
    if (e instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "payment error",
      };
    }

    return {
      status: "error",
      message: "error validating data",
    };
  }

  redirect(checkoutUrl);
}
