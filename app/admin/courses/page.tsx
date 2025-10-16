import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
export default async function CoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          create courses
        </Link>
      </div>

      <Suspense fallback={<AdminCourseSkeletonLayout />}>
        {" "}
        <RedneredCourses />{" "}
      </Suspense>
    </div>
  );
}

export async function RedneredCourses() {
  const data = await adminGetCourses();

  return data.length ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 mt-4">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course}></AdminCourseCard>
      ))}
    </div>
  ) : (
    <EmptyState
      title="No course found"
      description="Create a new course to get started"
      buttonText="create course"
      href="/admin/courses/create"
    />
  );
}

function AdminCourseSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 mt-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index}></AdminCourseCardSkeleton>
      ))}
    </div>
  );
}
