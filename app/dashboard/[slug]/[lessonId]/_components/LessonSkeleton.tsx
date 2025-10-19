import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
  return (
    <div className="flex flex-col h-full pl-6 mb-6">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full"></Skeleton>
      </div>

      <div className="flex-1 space-y-6 mt-4">
        <div className="space-y-5">
          <Skeleton className="h-8 w-3/4"></Skeleton>
          <Skeleton className="h-4 w-1/2"></Skeleton>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full"></Skeleton>
          <Skeleton className="h-4 w-5/6"></Skeleton>
          <Skeleton className="h-4 w-4/6"></Skeleton>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32"></Skeleton>
          <Skeleton className="h-10 w-5/24  "></Skeleton>
        </div>
      </div>
    </div>
  );
}
