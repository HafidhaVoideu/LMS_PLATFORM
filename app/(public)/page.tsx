import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  interface FeaturesType {
    title: string;
    description: string;
    icon: string;
  }
  const FEATURES: FeaturesType[] = [
    {
      title: "interactive Courses",
      description:
        "Engage with interactive lessons, quizzes, and assignments designed to enhance your learning experience.",
      icon: "🖥️",
    },
    {
      title: "Comprehensive Courses",
      description:
        "Access a wide range of courses across various subjects, all curated by industry experts.",
      icon: "📱",
    },

    {
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed progress tracking and performance analytics.",
      icon: "💹",
    },
    {
      title: "Community Support",
      description:
        "Join a vibrant community of learners and educators to share knowledge, ask questions, and collaborate.",
      icon: "🗨️",
    },
  ];

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col text-center items-center space-y-8">
          <Badge variant="outline">The future of Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tight">
            Elevate your Learning Experiene
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Discover a new way to learn with our moder, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
              })}
            >
              {" "}
              Explore Courses
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
            >
              {" "}
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {FEATURES.map((feature, index) => {
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-4xl nb-4">{feature.icon}</CardTitle>
                <CardDescription>{feature.title}</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground"> {feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </>
  );
}
