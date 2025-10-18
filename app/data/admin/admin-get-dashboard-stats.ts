"server only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
export async function adminGetDashboardStats() {
  await requireAdmin();

  const [usersCount, customersCount, coursesCount, lessonsCount] =
    await Promise.all([
      // totals courses
      prisma.user.count(),

      // total customers
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),

      // total courses

      prisma.course.count(),

      // total  lessons

      prisma.lesson.count(),
    ]);

  return { usersCount, customersCount, coursesCount, lessonsCount };
}
