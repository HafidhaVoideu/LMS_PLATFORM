import { EmptyState } from "@/components/general/EmptyState";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { enrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import { getRecentCourses } from "../data/admin/admin-get-recent-courses";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "./courses/_components/AdminCourseCard";

export default async function AdminIndexPage() {
  const erollmentsData = await enrollmentStats();
  return (
    <>
      <SectionCards />
      <div>
        <ChartAreaInteractive data={erollmentsData} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-semibold">Recent courses</h2>

          <Link
            href="/admin/courses"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            view all courses
          </Link>
        </div>
      </div>

      <Suspense fallback={<RenderRecentCoursesSkeleton />}>
        <RenderRecentCourses />
      </Suspense>
    </>
  );
}

async function RenderRecentCourses() {
  const recentCourses = await getRecentCourses();

  if (recentCourses.length === 0)
    return (
      <EmptyState
        buttonText="Create new course"
        description="Create a new course to get started"
        title="No course found"
        href="
        /admin/courses/create"
      />
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentCourses.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}
async function RenderRecentCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
