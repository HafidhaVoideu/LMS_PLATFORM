"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/client";


import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function Home() {
  const { data: session } = authClient.useSession()

  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
          toast.success("Signed out successfully!");
        },
      },
    });
  }
  return (
    <div className="p-12">
      <ThemeToggle></ThemeToggle>
      <h1>hello</h1>

      {session ? (
        <>
          {session.user?.email}
          <Button onClick={signOut}>log out</Button>
        </>
      ) : (
        <Button>log in</Button>
      )}
    </div>
  );
}
