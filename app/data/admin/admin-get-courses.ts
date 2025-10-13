import { notFound } from "next/navigation";
import { requireAdmin } from "./require-admin";

import { prisma } from "@/lib/db";
export async function adminGetCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
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
    },
  });

  if (!data) notFound();
  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
