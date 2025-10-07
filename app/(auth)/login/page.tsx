import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import LoginForm from "./_components/LoginForm";
// import { redirect } from "next/dist/server/api-utils";

import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    // Redirect to home page
    return redirect("/");
  }

  return <LoginForm></LoginForm>;
}
