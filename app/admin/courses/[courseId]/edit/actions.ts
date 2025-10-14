"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ResponseObjectType } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

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

export async function reorderLessons(
  courseId: string,
  chapterId: string,
  lessons: { position: number; id: string }[]
): Promise<ResponseObjectType> {
  await requireAdmin();

  try {
    if (!lessons || !lessons.length) {
      return {
        message: "no lessons to reorder",
        status: "success",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      message: "Lessons reordered successfully",
      status: "success",
    };
  } catch {
    return {
      message: "Failed to reorder lessons",
      status: "success",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { position: number; id: string }[]
): Promise<ResponseObjectType> {
  await requireAdmin();
  try {
    if (!chapters || !chapters.length) {
      return {
        message: "no chapters to reorder",
        status: "success",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      message: "Failed to reorder chapters",
      status: "success",
    };
  } catch {
    return {
      message: "Failed to reorder chapters",
      status: "success",
    };
  }
}
