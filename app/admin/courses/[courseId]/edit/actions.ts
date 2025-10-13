"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ResponseObjectType } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

export async function EditCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ResponseObjectType> {
  const session = await requireAdmin();

  try {
    const validatedData = courseSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        status: "error",
        message: "invalid data",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: session?.user.id as string,
      },
      data: {
        ...validatedData.data,
      },
    });
    return {
      message: "Course edited successfully",
      status: "success",
    };
  } catch {
    return {
      message: "an error has occured",
      status: "error",
    };
  }
}
