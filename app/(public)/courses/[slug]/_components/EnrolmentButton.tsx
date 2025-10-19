"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/use-try-catch";
import { useTransition } from "react";
import { enrollInCourseAction } from "../action";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EnrolmentButton({ courseId }: { courseId: string }) {
  const [pendingCourseEnrollment, startCourseEnrollmentTransition] =
    useTransition();

  async function onSubmit() {
    startCourseEnrollmentTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId)
      );

      if (error) {
        toast.error(error.message);
      }

      if (result?.status === "error") {
        toast.error(result.message);
      } else if (result?.status === "success") {
        toast.success(result.message);
      }
    });
  }

  return (
    <Button
      onClick={() => onSubmit()}
      // disabled={pendingCourseEnrollment}
      className="w-full "
    >
      {pendingCourseEnrollment ? (
        <>
          Loading... <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
}
