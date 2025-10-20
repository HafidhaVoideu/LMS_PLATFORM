import { publicGetCourses } from "@/app/data/course/course-get-courses";
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/PublicCourseCard";
import { Suspense } from "react";

// export const dynamic = "force-static";
export default async function PublicCoursesPage() {
  return (
    <div className="mt-4">
      <div className="flex-flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Explore Courses
        </h1>

        <p className="text-muted-foreground ">
          Discover a wide range of courses curated by industry experts to help
          you succeed in your career.
        </p>
      </div>

      <Suspense fallback={<RenderedPublicCourseSkeletonLayout />}>
        <RenderPublicCourse />
      </Suspense>
    </div>
  );
}

export async function RenderPublicCourse() {
  const courses = await publicGetCourses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course}></PublicCourseCard>
      ))}
    </div>
  );
}

export async function RenderedPublicCourseSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index}></PublicCourseCardSkeleton>
      ))}
    </div>
  );
}
