"use client";
import { LessonContentType } from "@/app/data/course/course-get-lesson-content";
import RenderDescription from "@/components/rich-text-editor/RenderDescriiption";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { tryCatch } from "@/hooks/use-try-catch";
import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { markLessonComplete } from "../action";

import { useConfetti } from "@/hooks/use-conffeti";
import { toast } from "sonner";

interface CourseConentProps {
  data: LessonContentType;
}

function VideoPlayer({
  thumbnailKey,
  videoKey,
}: {
  thumbnailKey: string;
  videoKey: string;
}) {
  const thumbnailUrl = useConstructUrl(thumbnailKey);

  const videoUrl = useConstructUrl(videoKey);

  if (!videoKey)
    return (
      <div className=" aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
        <BookIcon className="size-16 text-primary mb-4 mx-auto"></BookIcon>

        <p className="text-muted-foreground">
          This lesson doesn&apos;t have a video yet.
        </p>
      </div>
    );

  return (
    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
      <video
        className="w-full h-full object-cover"
        controls
        poster={thumbnailUrl}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/ogg" />
        <source src={videoUrl} type="video/webm" />
        Your borwser doesn&apos;t supportthe video tag.
      </video>
    </div>
  );
}
export function CourseConent({ data }: CourseConentProps) {
  const [pendingProgress, startProgressTransition] = useTransition();

  const { triggerConfetti } = useConfetti();

  async function onSubmit() {
    startProgressTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.chapter.course.slug)
      );

      if (error) {
        toast.error(error.message);
      }

      if (result?.status === "error") {
        toast.error(result.message);
      } else if (result?.status === "success") {
        triggerConfetti();

        toast.success(result.message);
      }
    });

    //
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      ></VideoPlayer>
      <div className="py-4 border-b">
        {data.lessonProgress.length ? (
          <Button
            variant="outline"
            className="bg-green-500/10  text-green-500 hover:text-green-700"
          >
            <CheckCircle className="size-4 mr-2 text-green-500"></CheckCircle>
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled={pendingProgress}
            onClick={onSubmit}
          >
            <CheckCircle className="size-4 mr-2 text-green-500"></CheckCircle>
            Mark as completed
          </Button>
        )}
      </div>

      <div>
        <h1 className="space-y-3 pt-3 text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>

        {data.description && (
          <RenderDescription html={data.description}></RenderDescription>
        )}
      </div>
    </div>
  );
}
