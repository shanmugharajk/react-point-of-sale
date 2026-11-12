import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AppSidebar } from "~/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { getSession } from "~/lib/session";

type ProtectedShellProps = {
  children: React.ReactNode;
};

// The one real auth gate — the proxy only checks that a cookie exists.
// Suspense is required: cache components reject headers() in a layout body.
async function ProtectedShell({ children }: ProtectedShellProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <header className="flex h-12 items-center border-b px-2 md:hidden">
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Suspense fallback={null}>
      <ProtectedShell>{children}</ProtectedShell>
    </Suspense>
  );
}
