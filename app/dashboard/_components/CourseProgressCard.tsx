"use client";
import { EnrolledCourseType } from "@/app/data/user/dashboard-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-progrress-course";

import Image from "next/image";
import Link from "next/link";
interface CourseProgressCardProps {
  data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: CourseProgressCardProps) {
  const thumbnail = useConstructUrl(data.course.fileKey);

  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ course: data.course });

  return (
    <Card className="group relative     py-0 gap-0 flex">
      <Badge className="absolute right-2 top-2 z-10">{data.course.level}</Badge>

      <Image
        src={thumbnail}
        alt={data.course.title}
        // fill
        width={600}
        height={500}
        className="  h-full w-full rounded-t-xl aspect-video object-cover"
      ></Image>

      <CardContent className="p-4">
        <Link
          href={`/dashboard/${data.course.slug}`}
          className="font-medium text-lg  line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {" "}
          {data.course.title}
        </Link>

        <p className="line-clamp-2 mt-2 leading-tight text-sm text-muted-foreground">
          {data.course.smallDescription}
        </p>
        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress</p>

            <p className="font-medium">{progressPercentage}%</p>
          </div>

          <Progress value={progressPercentage} className="h-1.5" />

          <p className="text-xs text-muted-foreground mt-1">
            {" "}
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.course.slug}`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0 flex">
      <div className="absolute right-2 top-2 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full"></Skeleton>
      </div>

      <div className="w-full relative min-h-[260px]">
        <Skeleton className="w-full h-full rounded-t-xl aspect:video">
          {" "}
        </Skeleton>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full"> </Skeleton>
          <Skeleton className="h-6 w-3/4"> </Skeleton>
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="gap-x-2 flex items-center">
            <Skeleton className="size-6  rounded-md"></Skeleton>
            <Skeleton className="w-8 h-4 rounded-md"></Skeleton>
          </div>
          <div className="gap-x-2 flex items-center">
            <Skeleton className="size-6  rounded-md"></Skeleton>
            <Skeleton className="w-8  h-4 rounded-md"></Skeleton>
          </div>
        </div>

        <Skeleton className=" mt-4 h-10 w-full rounded-md"></Skeleton>
      </CardContent>
    </Card>
  );
}
