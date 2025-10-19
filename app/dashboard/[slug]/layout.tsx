import { getCourseSidebarData } from "@/app/data/course/course-get-sidebar-data";
import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";

interface CourseLayoutProps {
  params: Promise<{ slug: string }>;

  children: ReactNode;
}
export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);
  return (
    // sidebar
    <div className="flex flex-1">
      <div className="w-80 border-r border-border shrink-0">
        <CourseSidebar course={course}></CourseSidebar>
      </div>

      {/* main content */}

      <div className="flex-1 overflow">{children}</div>
    </div>
  );
}
