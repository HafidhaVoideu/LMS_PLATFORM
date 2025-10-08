import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold">Your Courses </h1>

        <Link href="/admin/courses/create" className={buttonVariants()}>
          {" "}
          create courses
        </Link>
      </div>
      <div>here you will see all the courses</div>
    </div>
  );
}
