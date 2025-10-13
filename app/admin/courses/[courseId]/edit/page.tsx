import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import EditCourseForm from "./_components/EditCourseForm";

type Params = Promise<{ courseId: string }>;
export default async function EditCoursePage({ params }: { params: Params }) {
  const { courseId } = await params;
  const data = await adminGetCourse(courseId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course:
        <span className="text-primary underline"> {data?.title}</span>
      </h1>

      <Tabs defaultValue="" className="w-full ">
        <TabsList className="grid w-full grid-cols-2 gap-2 bg-gray-700 ">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle> Basic Info</CardTitle>

              <CardDescription>Edit the course's basic info</CardDescription>
            </CardHeader>

            <CardContent>
              <EditCourseForm courseId={courseId} data={data}></EditCourseForm>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
