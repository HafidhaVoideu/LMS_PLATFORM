"use client";

import { authClient } from "@/lib/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSignout() {
  const router = useRouter();
  const handleSignout = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully!");
          router.push("/");
        },
        onError: () => {
          toast.error("Error signing out");
        },
      },
    });
  };

  return handleSignout;
}
