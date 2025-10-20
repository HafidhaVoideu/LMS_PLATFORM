import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminCourseCardProps {
  data: AdminCourseType;
}
export default function AdminCourseCard({ data }: AdminCourseCardProps) {
  const fullUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      {/* absoloute dropdown */}

      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {/* edit course */}
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Pencil className="size-4 mr-2" />
                Edit course
              </Link>
            </DropdownMenuItem>

            {/* preview course  */}

            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`}>
                <Eye className="size-4 mr-2" />
                Preview
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* delete */}

            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive" />
                Delete course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Image
        src={fullUrl}
        alt=" course thumbnail"
        width={600}
        height={400}
        className=" w-full rounded-t-lg aspect-video h-full  object-cover"
      ></Image>

      <CardContent className="p-4">
        <Link
          href={`/courses/${data.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}{" "}
        </Link>

        <p className="line-clmap-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.smallDescription}
        </p>

        <div className="flex items-center gap-x-5 mt-4">
          {/* duration */}
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />

            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>

          {/* level */}

          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />

            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>

        <Link
          className={buttonVariants({
            className: "w-full mt-4",
          })}
          href={`/admin/courses/${data.id}/edit`}
        >
          Edit course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {/* <Skeleton className="h-16 w-16 rounded-full"></Skeleton> */}
        <Skeleton className="size-8 rouned-md"></Skeleton>
      </div>

      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover"></Skeleton>
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded"></Skeleton>
        <Skeleton className="h-4 w-full mb-4 rounded"></Skeleton>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6  rounded-md"></Skeleton>
            <Skeleton className=" h-4 w-10 "></Skeleton>
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6  rounded-md"></Skeleton>
            <Skeleton className=" h-4 w-10 "></Skeleton>
          </div>
        </div>

        <Skeleton className=" mt-4 h-10 w-full rounded"></Skeleton>
      </CardContent>
    </Card>
  );
}
