"use client";

import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/login");
      }}
    >
      Sign out
    </Button>
  );
}
