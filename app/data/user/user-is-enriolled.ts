import { auth } from "@/lib/auth";

import { headers } from "next/headers";

import { prisma } from "@/lib/db";

export async function checkIfCourseIsBought(
  courseId: string
): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return false;

  const enrolement = await prisma.enrolment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId,
      },
    },

    select: {
      status: true,
    },
  });

  return enrolement?.status === "Active" ? true : false;
}
