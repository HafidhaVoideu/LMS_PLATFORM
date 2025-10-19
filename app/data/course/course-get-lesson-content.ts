import { requireUser } from "../user/user-session";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
export async function getLessonContent(lessonId: string) {
  const user = await requireUser();
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },

    select: {
      id: true,
      title: true,
      description: true,
      videoKey: true,
      thumbnailKey: true,
      position: true,

      lessonProgress: {
        where: {
          userId: user.id,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      chapter: {
        select: { courseId: true, course: { select: { slug: true } } },
      },
    },
  });
  if (!lesson) notFound();

  const enrollment = await prisma.enrolment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: lesson.chapter.courseId,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment?.status !== "Active") return notFound();

  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
