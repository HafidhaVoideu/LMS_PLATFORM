"use client";
import { SidebarCourseType } from "@/app/data/course/course-get-sidebar-data";
import { useMemo } from "react";

interface CourseProgressType {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}
interface CourseProgress {
  course: SidebarCourseType;
}

export function useCourseProgress({
  course,
}: CourseProgress): CourseProgressType {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    course.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;

        const completed = lesson.lessonProgress.some(
          (progress) =>
            progress.lessonId === lesson.id && progress.completed === true
        );
        if (completed) completedLessons++;
      });
    });

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      totalLessons,
      completedLessons,
      progressPercentage,
    };
  }, [course]);
}
