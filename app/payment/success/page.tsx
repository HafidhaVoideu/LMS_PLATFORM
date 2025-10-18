"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-conffeti";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex justify-center items-center w-full">
            <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full"></CheckIcon>
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>

            <p className="text-sm mt-2 text-muted-foreground tracking-light text-balance">
              Congrats, you have successfully completed your payment. You now
              have access to the course.
            </p>

            <Link
              className={buttonVariants({ className: "w-full mt-5" })}
              href="/"
            >
              <ArrowLeftIcon className="mr-2 size-4" />
              Go to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
