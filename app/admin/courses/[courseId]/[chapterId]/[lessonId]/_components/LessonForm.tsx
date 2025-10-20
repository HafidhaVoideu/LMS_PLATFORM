"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import Uploader from "@/components/file-uploader/Uploader";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/use-try-catch";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateLesson } from "../actions";
interface LessonFormProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}
export function LessonForm({ data, chapterId, courseId }: LessonFormProps) {
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: data.title,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey,
      videoKey: data.videoKey,
      chapterId: chapterId,
      courseId: courseId,
    },
  });

  const [pendingLessonUpdate, startLessonUpdateTransition] = useTransition();

  async function onSubmit(values: LessonSchemaType) {
    startLessonUpdateTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson(values, data.id)
      );
      if (error) {
        toast.error(error.message);
      }
      if (result?.status === "error") {
        toast.error(result.message);
      } else if (result?.status === "success") {
        toast.success(result.message);
      }
    });
  }
  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({
          variant: "outline",
          className: "mb-6",
        })}
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle> Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the video and the description for this lesson.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* lesson title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the Lesson's Title"
                        {...field}
                      ></Input>
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              {/* lesson Description */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        onChange={field.onChange}
                        value={field.value ?? ""}
                      />
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              {/* lesson thumbnail image */}

              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <Uploader
                        fileTypeAccepted="image"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              {/* lesson video*/}
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video File</FormLabel>
                    <FormControl>
                      <Uploader
                        fileTypeAccepted="video"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              <Button type="submit" disabled={pendingLessonUpdate}>
                {pendingLessonUpdate ? "Saving..." : "Save Lesson"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
