"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ResponseObjectType } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchemas";

import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);

//Edot course
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

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found.",
      };
    }

    if (course.userId !== session?.user.id) {
      return {
        status: "error",
        message: "Not authorized to edit this course.",
      };
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        ...validatedData.data,
      },
    });
    return {
      message: "Course edited successfully",
      status: "success",
    };
  } catch (e) {
    console.error("❌ ERROR in EditCourse:", e);
    return {
      message: "an error has occured",
      status: "error",
    };
  }
}

// reorder lessons
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

// reorder chapters
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

// create lesson
export async function createLesson(
  values: LessonSchemaType
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
    const validatedData = lessonSchema.safeParse(values);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "invalid data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: validatedData.data.chapterId,
        },

        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await prisma.lesson.create({
        data: {
          title: validatedData.data.title,
          description: validatedData.data.description,
          videoKey: validatedData.data.videoKey || "",
          thumbnailKey: validatedData.data.thumbnailKey || "",
          chapterId: validatedData.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${validatedData.data.courseId}/edit`);
    return {
      status: "success",
      message: "CLesson created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "an error has occured",
    };
  }
}
export async function createChapter(
  values: ChapterSchemaType
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
    const validatedData = chapterSchema.safeParse(values);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "invalid data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: validatedData.data.courseId,
        },

        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await prisma.chapter.create({
        data: {
          title: validatedData.data.name,
          courseId: validatedData.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${validatedData.data.courseId}/edit`);
    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "an error has occured",
    };
  }
}

// delete lesson

export async function deleteLesson(
  courseId: string,
  chapterId: string,
  lessonId: string
): Promise<ResponseObjectType> {
  await requireAdmin();

  // find the lessons
  try {
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },

      select: {
        lessons: {
          select: {
            id: true,
            position: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!chapter)
      return {
        status: "error",
        message: "chapter not found ",
      };
    const lessons = chapter.lessons;

    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

    if (!lessonToDelete)
      return {
        status: "error",
        message: "lesson not found",
      };

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updateLessons = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updateLessons,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "an error has occured",
    };
  }
}

// delete chapter
export async function deleteChapter(
  courseId: string,
  chapterId: string
): Promise<ResponseObjectType> {
  await requireAdmin();

  // find the lessons
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },

      select: {
        chapters: {
          select: {
            id: true,
            position: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course)
      return {
        status: "error",
        message: "course not found ",
      };
    const chapters = course.chapters;

    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId
    );

    if (!chapterToDelete)
      return {
        status: "error",
        message: "chapter not found",
      };

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updateChapters = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updateChapters,
      prisma.chapter.delete({
        where: {
          id: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "chapter deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "an error has occured",
    };
  }
}
