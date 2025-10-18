"server only";
import { requireAdmin } from "./require-admin";

import { prisma } from "@/lib/db";

export async function getRecentCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    take: 3,
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

  return data;
}
