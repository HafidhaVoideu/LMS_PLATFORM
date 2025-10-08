"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/client";
import { GithubIcon, Loader, SendIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
export default function LoginForm() {
  const [isGithubLoading, githubStartTransition] = useTransition();
  const [isEmailLoading, emailStartTransition] = useTransition();
  const [email, setEmail] = useState("");
  const router = useRouter();

  // sign in with github
  const signInWithGithub = async () => {
    githubStartTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          /*************  ✨ Windsurf Command ⭐  *************/
          /**
           * Called when the sign in request was successful.
           *
           * @param {object} res - the response from the server
           */
          /*******  81c02264-39c2-433a-8519-dcefe3fa75c2  *******/
          onSuccess: (res) => {
            toast.success("Signed in successfully! You will be redirected...");
          },
          onError: (error) => {
            toast.error("internal server error: ");
          },
        },
      });
    });
  };

  // sign in with email

  const signinWithEmail = async () => {
    emailStartTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",

        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification email sent! Please check your inbox.");
            router.push(`/verify-request?email=${email}`);
          },

          onError: (error) => {
            toast.error("internal server error: ");
          },
        },
      });
    });
  };

  return (
    <Card>
      <CardHeader className="text-xl">
        Welcome back!
        <CardDescription className="">
          Login with your Github Account or email address
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={isGithubLoading}
          onClick={signInWithGithub}
          className="w-full"
          variant="outline"
        >
          {isGithubLoading ? (
            <>
              <Loader className="size-4 animate-spin"></Loader>
              loading...
            </>
          ) : (
            <>
              <GithubIcon className="size-4"></GithubIcon>
              sign in with Github
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center  after:border-t after:border-border after:z-0">
          <span className="relative z-10 text-muted-foreground px-2 bg-card ">
            or continue with
          </span>
        </div>

        <div className=" grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">email</Label>
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="example@email.com"
            ></Input>
          </div>

          <Button
            onClick={signinWithEmail}
            disabled={isEmailLoading}
            className=""
          >
            {isEmailLoading ? (
              <>
                <Loader className="size-4 animate-spin"></Loader>
                loading...
              </>
            ) : (
              <>
                <SendIcon className="size-4"></SendIcon>
                <span>continue with email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
