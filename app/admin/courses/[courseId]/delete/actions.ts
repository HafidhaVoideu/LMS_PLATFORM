"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ResponseObjectType } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function deleteCourse(
  courseId: string
): Promise<ResponseObjectType> {
  await requireAdmin();

  // find the lessons
  try {
    const course = await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath(`/admin/courses`);
    return {
      status: "success",
      message: "course deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "an error has occured",
    };
  }
}
