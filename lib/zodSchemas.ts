import z from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const courseCategories = [
  "Web Development",
  "Data Science",
  "Graphic Design",
  "Digital Marketing",
  "Cybersecurity",
  "Artificial Intelligence",
  "Business & Management",
  "Photography",
  "Mobile App Development",
  "Personal Development",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Title must be at least 3 characters" })
    .max(100, { error: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(3, { error: "Description must be at least 3 characters" })
    .max(1000, { error: "Description must be less than 1000 characters" }),
  fileKey: z.string().min(1, { error: "File key is required" }),
  price: z.coerce
    .number<number>()
    .min(1, { error: "Price must be a positive number" }),
  duration: z.coerce
    .number<number>()
    .min(1, { error: "Duration must be at lest one hour" })
    .max(500, { error: "Duration must be less than 500 hours" }),
  level: z.enum(courseLevels, { error: "Level is required" }),
  category: z.enum(courseCategories, { error: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { error: "Small description must be at least 3 characters" })
    .max(300, { error: "Small description must be less than 200 characters" }),
  slug: z.string().min(3, { error: "Slug must be at least 3 characters" }),
  status: z.enum(courseStatus, { error: "Status is required" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
