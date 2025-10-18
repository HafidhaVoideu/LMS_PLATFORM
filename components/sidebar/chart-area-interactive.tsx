"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useMemo } from "react";

export const description = "An interactive area chart";

// const dummyEnrollmentData = Array.from({ length: 30 }, (_, i) => {
//   const date = new Date(2024, 3, i + 1); // April 2024 (month index 3)
//   return {
//     date: date.toISOString().split("T")[0],
//     enrollments: Math.floor(Math.random() * 15) + 1, // random between 1 and 15
//   };
// });

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: {
    date: string;
    enrollments: number;
  }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollments = useMemo(() => {
    return data.reduce((total, items) => total + items.enrollments, 0);
  }, [data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrolments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total fEnrolements in the last 30 days: {totalEnrollments}
          </span>
          <span className="@[540px]/card:hidden">
            Last 30 days:{totalEnrollments}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={data}
            margin={{
              left: 32,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                const date = new Date(value);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);

                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                ></ChartTooltipContent>
              }
            />

            <Bar dataKey="enrollments" fill="var(--chart-1)"></Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
