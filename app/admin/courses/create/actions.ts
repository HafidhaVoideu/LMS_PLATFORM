"use server";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ResponseObjectType } from "@/lib/types";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
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

  const req = await request();

  try {
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });

    console.log("arcjet decision:", decision.isDenied());
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

    const dataPrisma = await prisma.course.create({
      data: {
        ...validatedData.data,
        userId: session?.user.id as string,
      },
    });

    return {
      status: "success",
      message: "course created successfully",
    };
  } catch (e) {
    return {
      status: "error",
      message: "error validating data",
    };
  }
}
