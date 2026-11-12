import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "~/lib/session";

import { SignOutButton } from "./sign-out-button";

async function SignedInView() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Signed in as {session.user.email} ({session.user.role ?? "staff"})
      </p>
      <SignOutButton />
    </>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
      <h1 className="text-2xl font-semibold">point-of-sale</h1>
      <Suspense>
        <SignedInView />
      </Suspense>
    </main>
  );
}
