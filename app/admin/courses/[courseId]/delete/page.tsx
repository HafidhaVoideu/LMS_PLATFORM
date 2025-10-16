"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";

import { toast } from "sonner";

import { deleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

// type Params = Promise<{ courseId: string }>;

export default function DeleteCoursePage() {
  const [pendingCourseDelete, startCourseDeleteTransition] = useTransition();

  const { courseId } = useParams<{ courseId: string }>();

  const router = useRouter();
  async function onSubmit() {
    startCourseDeleteTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));
      if (error) {
        toast.error(error.message);
      }
      if (result?.status === "error") {
        toast.error(result.message);
      } else if (result?.status === "success") {
        toast.success(result.message);

        router.push("/admin/courses");
      }
    });
  }
  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle> Are you sure you want to delete this course?</CardTitle>

          <CardDescription>
            This action cannot be undone. This will permanently delete the
            selected course.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            Cancel
          </Link>

          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={pendingCourseDelete}
          >
            {pendingCourseDelete ? (
              <>
                <Loader2 className="animate-spin size-4"></Loader2>
                Deleteing...
              </>
            ) : (
              <>
                <Trash2 className="size-4"></Trash2>
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
