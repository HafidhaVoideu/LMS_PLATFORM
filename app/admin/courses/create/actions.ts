"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ResponseObjectType } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

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
