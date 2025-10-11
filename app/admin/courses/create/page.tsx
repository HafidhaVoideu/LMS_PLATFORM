"use client";
import Uploader from "@/components/file-uploader/Uploader";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { tryCatch } from "@/hooks/use-try-catch";
import {
  courseCategories,
  courseLevels,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { CreateCourse } from "./actions";

import { useRouter } from "next/navigation";

import { useTransition } from "react";
import { toast } from "sonner";
export default function CreateCoursePage() {
  const router = useRouter();

  const [pendingCourseCreation, startCourseCreationTransition] =
    useTransition();
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      category: "Web Development",
      smallDescription: "",
      slug: "",
      status: "Draft",
    },
  });

  async function onSubmit(values: CourseSchemaType) {
    startCourseCreationTransition(async () => {
      const { data: result, error } = await tryCatch(CreateCourse(values));

      if (error) {
        toast.error(error.message);
      }

      if (result?.status === "error") {
        toast.error(result.message);
      } else if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      }
    });

    // console.log(values);
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>

        <h1 className="text-2xl font-bold">Create Courses</h1>
      </div>

      {/* Form */}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide Basic Information about the course
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* title    */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Course Title"
                        {...field}
                      ></Input>
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              {/* slug */}

              <div className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="slug" {...field}></Input>
                      </FormControl>

                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>

                <Button
                  type="button"
                  onClick={() => {
                    const titleValue = form.getValues("title");

                    const slug = slugify(titleValue);

                    form.setValue("slug", slug, { shouldValidate: true });
                  }}
                >
                  Generate Slug
                  <SparkleIcon className="ml-1" size={12}></SparkleIcon>
                </Button>
              </div>

              {/* small description */}
              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Small Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Small Description"
                        className="min-h-[120px]"
                        {...field}
                      ></Textarea>
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              {/* description */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              {/* Filekey */}
              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Thumbnail image</FormLabel>
                    <FormControl>
                      <FormControl>
                        <Uploader
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              {/* categories */}

              <div className="grid gird-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>

                          <SelectContent>
                            {courseCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>

                {/* level */}

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a level" />
                          </SelectTrigger>

                          <SelectContent>
                            {courseLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>

                {/* duration */}

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Duration"
                          type="number"
                          {...field}
                        ></Input>
                      </FormControl>

                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>

                {/* price */}

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Price"
                          type="number"
                          {...field}
                        ></Input>
                      </FormControl>

                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              {/* status */}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>

                        <SelectContent>
                          {courseStatus.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              <Button
                type="submit"
                className=""
                disabled={pendingCourseCreation}
              >
                {pendingCourseCreation ? (
                  <>
                    Creating...
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Create Course <PlusIcon className=" ml-1" size={16} />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
