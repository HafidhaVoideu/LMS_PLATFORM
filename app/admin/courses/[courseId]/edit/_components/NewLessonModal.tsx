"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createLesson } from "../actions";

export default function NewLessonModal({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  //   const router = useRouter();

  const [pendingChapterCreation, startChapterCreationTransition] =
    useTransition();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      courseId,
      chapterId,
      title: "",
    },
  });
  const handleIsOpen = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  async function onSubmit(values: LessonSchemaType) {
    startChapterCreationTransition(async () => {
      const { data: result, error } = await tryCatch(createLesson(values));
      if (error) {
        toast.error(error.message);
      }
      if (result?.status === "error") {
        toast.error(result.message);
      } else if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
        // router.push("/admin/courses");
      }
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className=" w-full gap-2 justify-center">
          <Plus className="size-4" /> New Lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Lesson</DialogTitle>
          <DialogDescription>
            what would you like to call this lesson?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chapter name" {...field}></Input>
                  </FormControl>

                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>

            <DialogFooter>
              <Button type="submit" disabled={pendingChapterCreation}>
                {pendingChapterCreation ? "Loading..." : " Save Change"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
``;
