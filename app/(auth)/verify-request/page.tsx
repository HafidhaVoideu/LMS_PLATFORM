"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useTransition } from "react";

import { Card } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function VerifyRequestPage() {
  const [opt, setOpt] = useState("");
  const [isEmailVeirifcationPending, startEmailVerificationTransition] =
    useTransition();

  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const isOptComplete = opt.length === 6;

  async function verifyEmail() {
    startEmailVerificationTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email || "",
        otp: opt,
        fetchOptions: {
          /*************  ✨ Windsurf Command ⭐  *************/
          /**
           * Called when the email verification is successful.
           * Shows a success toast and redirects the user to the root page.
           */
          /*******  253d88b4-0103-4f8b-8ead-18e0b21808cb  *******/ onSuccess:
            () => {
              toast.success("Email verified successfully!");
              router.push("/");
            },

          onError: (error) => {
            toast.error("Failed to verify email. Please try again.");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className=" text-xl">Check your email</CardTitle>

        <CardDescription className="">
          We have sent a verification email code to your email address. Please
          check your inbox and copy and paste the code below to verify your
          account.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-y-6">
        <div className="flex flex-col space-y-2 items-center">
          <InputOTP maxLength={6} onChange={(value) => setOpt(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0}> </InputOTPSlot>
              <InputOTPSlot index={1}> </InputOTPSlot>
              <InputOTPSlot index={2}> </InputOTPSlot>
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3}> </InputOTPSlot>
              <InputOTPSlot index={4}> </InputOTPSlot>
              <InputOTPSlot index={5}> </InputOTPSlot>
            </InputOTPGroup>
          </InputOTP>

          <p className=" text-sm text-muted-foreground">
            {" "}
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Button
          onClick={verifyEmail}
          disabled={!isOptComplete || isEmailVeirifcationPending}
          className="w-full"
        >
          {isEmailVeirifcationPending ? (
            <>
              <Loader className="size-4 animate-spin"></Loader>
              <span>Verifying</span>
            </>
          ) : (
            <>
              <span>Verify account</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
