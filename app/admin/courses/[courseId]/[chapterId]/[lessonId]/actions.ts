"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ResponseObjectType } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);
export async function updateLesson(
  data: LessonSchemaType,
  lessonId: string
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

    const validatedData = lessonSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "invalid data",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        description: validatedData.data.description,
        title: validatedData.data.title,
        videoKey: validatedData.data.videoKey,
        thumbnailKey: validatedData.data.thumbnailKey,
      },
    });

    return {
      status: "success",
      message: "lesson updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "error validating data",
    };
  }
}
