"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ResponseObjectType } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

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
export async function EditCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ResponseObjectType> {
  const session = await requireAdmin();

  try {
    const req = await request();
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

    await prisma.course.update({
      where: {
        id: courseId,
        userId: session?.user.id as string,
      },
      data: {
        ...validatedData.data,
      },
    });
    return {
      message: "Course edited successfully",
      status: "success",
    };
  } catch {
    return {
      message: "an error has occured",
      status: "error",
    };
  }
}
