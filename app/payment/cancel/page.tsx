import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowLeftIcon, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex justify-center items-center w-full">
            <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full"></XIcon>
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>

            <p className="text-sm mt-2 text-muted-foreground tracking-light text-balance">
              Don't worry, you won't be charged. Please try again !
            </p>

            <Link
              className={buttonVariants({ className: "w-full mt-5" })}
              href="/"
            >
              <ArrowLeftIcon className="mr-2 size-4" />
              Go back to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
