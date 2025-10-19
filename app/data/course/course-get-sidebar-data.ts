import { requireUser } from "../user/user-session";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";

export async function getCourseSidebarData(slug: string) {
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      status: true,
      slug: true,
      level: true,
      price: true,
      fileKey: true,
      category: true,
      description: true,

      chapters: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              description: true,
              position: true,
              lessonProgress: {
                where: {
                  userId: user.id,
                },
                select: {
                  completed: true,
                  lessonId: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) return notFound();

  const enrolled = await prisma.enrolment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrolled || enrolled?.status !== "Active") notFound();

  return course;
}

export type SidebarCourseType = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
