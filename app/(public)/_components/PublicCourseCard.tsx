import { PublicCourseType } from "@/app/data/course/course-get-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { School, TimerIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
interface PublicCourseCardProps {
  data: PublicCourseType;
}
export function PublicCourseCard({ data }: PublicCourseCardProps) {
  const thumbnail = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative     py-0 gap-0 flex">
      <Badge className="absolute right-2 top-2 z-10">{data.level}</Badge>

      <Image
        src={thumbnail}
        alt={data.title}
        // fill
        width={600}
        height={500}
        className="  h-full w-full rounded-t-xl aspect-video object-cover"
      ></Image>

      <CardContent className="p-4">
        <Link
          href={`/courses/${data.slug}`}
          className="font-medium text-lg  line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {" "}
          {data.title}
        </Link>

        <p className="line-clamp-2 mt-2 leading-tight text-sm text-muted-foreground">
          {data.smallDescription}
        </p>

        <div className="flex items-center gap-x-5 mt-4">
          <div className="flex items-center gap-x-2">
            {" "}
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10"></TimerIcon>
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            {" "}
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10"></School>
            <p className="text-sm text-muted-foreground">{data.category}</p>
          </div>
        </div>

        <Link
          href={`/courses/${data.slug}`}
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
