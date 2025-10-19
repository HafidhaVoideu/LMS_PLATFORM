import { EmptyState } from "@/components/general/EmptyState";
import { publicGetCourses } from "../data/course/course-get-courses";
import { getEnrolledCourses } from "../data/user/dashboard-enrolled-courses";

import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [enrolledCourses, courses] = await Promise.all([
    getEnrolledCourses(),
    publicGetCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>

        <p className="text-muted-foreground">
          Here you can see all the courses you have access to.
        </p>
      </div>

      {!enrolledCourses.length ? (
        <EmptyState
          title="No courses purchsed"
          description="You have not purchased any courses yet."
          buttonText="Browsee courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
          {enrolledCourses.map((enrolledCourse) => (
            <CourseProgressCard
              key={enrolledCourse.course.id}
              data={enrolledCourse}
            ></CourseProgressCard>
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Available Courses</h1>

          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase.
          </p>
        </div>

        {!courses.filter(
          (course) =>
            !enrolledCourses.some(
              (enrolledCourse) => enrolledCourse.course.id === course.id
            )
        ).length ? (
          <EmptyState
            title="No courses available"
            description="You have purchased all the available courses"
            buttonText="Browse courses"
            href="/courses"
          ></EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    (enrolledCourse) => enrolledCourse.course.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard
                  key={course.id}
                  data={course}
                ></PublicCourseCard>
              ))}
          </div>
        )}
      </section>
    </>
  );
}
