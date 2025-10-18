"server only";
import { notFound } from "next/navigation";
import { requireAdmin } from "./require-admin";

import { prisma } from "@/lib/db";
export async function adminGetCourse(id: string) {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id,
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
        select: {
          id: true,
          title: true,
          position: true,

          lessons: {
            select: {
              id: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              title: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!data) notFound();
  return data;
}

export type AdminSingleCourseType = Awaited<ReturnType<typeof adminGetCourse>>;
