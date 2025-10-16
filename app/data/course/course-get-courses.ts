import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
export async function publicGetCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "Published",
    },

    orderBy: {
      createdAt: "desc",
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
    },
  });

  if (!data) notFound();
  return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof publicGetCourses>>[0];
