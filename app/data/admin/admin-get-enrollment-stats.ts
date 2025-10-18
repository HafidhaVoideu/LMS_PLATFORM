"server only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function enrollmentStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const data = await prisma.enrolment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const last30days: { date: string; enrollments: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    last30days.push({
      date: date.toISOString().split("T")[0],
      enrollments: 0,
    });
  }

  data.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];

    const findIndex = last30days.findIndex(
      (day) => day.date === enrollmentDate
    );

    if (findIndex !== -1) {
      last30days[findIndex].enrollments += 1;
    }
  });

  return last30days;
}
