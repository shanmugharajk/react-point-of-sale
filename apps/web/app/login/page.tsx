import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "~/lib/session";

import { LoginForm } from "./login-form";

async function SignedInRedirect() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return null;
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Point of Sale</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your shop account
          </p>
        </div>
        <Suspense>
          <SignedInRedirect />
        </Suspense>
        <LoginForm />
      </div>
    </main>
  );
}
