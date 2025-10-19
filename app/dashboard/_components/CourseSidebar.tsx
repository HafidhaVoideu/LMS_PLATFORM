"use client";
import { SidebarCourseType } from "@/app/data/course/course-get-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-progrress-course";
export function CourseSidebar({ course }: { course: SidebarCourseType }) {
  const pathname = usePathname();

  const currentId = pathname.split("/").pop();

  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ course });

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex item-centers gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Play className="size-5 text-primary"></Play>{" "}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {" "}
              {course.title}
            </h1>

            <p className="text-xs text-muted-foreground truncate">
              {course.category}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground"> Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons}
            </span>
          </div>
          <Progress value={40} className="h-1.5" />

          <p className="text-xs text-muted-foreground">
            {progressPercentage} % complete
          </p>
        </div>
      </div>

      <div className="py-4 pr-4 space-y-3">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index == 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-3 h-auto flex items-center gap-2"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.position}: {chapter.title}
                  </p>

                  <p className="text-[10px] text-muted-foreground truncate">
                    {chapter.lessons.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  slug={course.slug}
                  isActive={lesson.id === currentId}
                  completed={
                    lesson.lessonProgress?.find(
                      (progress) => progress.lessonId == lesson.id
                    )?.completed || false
                  }
                ></LessonItem>
              ))}
            </CollapsibleContent>{" "}
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
