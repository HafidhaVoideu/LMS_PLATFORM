"use server";
import { requireUser } from "./../../../data/user/user-session";

import { prisma } from "@/lib/db";

import { ResponseObjectType } from "@/lib/types";
import { revalidatePath } from "next/cache";
export async function markLessonComplete(
  lessonId: string,
  slug: string
): Promise<ResponseObjectType> {
  const user = await requireUser();

  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
      },

      create: {
        userId: user.id,
        lessonId: lessonId,
        completed: true,
      },
    });

    revalidatePath(`/dashboard/${slug}`);
    return {
      status: "success",
      message: `Progress updated successfully`,
    };
  } catch {
    return {
      status: "error",
      message: `Problem creating progress`,
    };
  }
}
