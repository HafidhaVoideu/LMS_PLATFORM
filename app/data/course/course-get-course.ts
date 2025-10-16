import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
export async function publicGetCourse(slug: string) {
  const data = await prisma.course.findUnique({
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

          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,

              title: true,
            },
          },
        },
      },
    },
  });

  if (!data) notFound();
  return data;
}

export type PublicSingleCourseType = Awaited<
  ReturnType<typeof publicGetCourse>
>;
