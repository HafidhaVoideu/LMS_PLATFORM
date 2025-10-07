import { ReactNode } from "react";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

import logo from "@/public/logo.svg";
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-svh ">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute left-4 top-4",
        })}
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="w-full max-w-sm flex flex-col gap-6">
        <Link
          href={"/"}
          className="flex items-center self-center font-medium gap-2"
        >
          <Image src={logo} alt="logo" width={120} height={120}></Image>
          {/* LMS Platform. */}
        </Link>

        {children}

        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary hover:underline">
            Terms of service
          </span>
          and{" "}
          <span className="hover:text-primary hover:underline">
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
}
