import { CustomerListQuerySchema } from "@point-of-sale/contracts";
import { customersService } from "@point-of-sale/services";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { buttonVariants } from "~/components/ui/button";
import { getSession } from "~/lib/session";

import { CustomersTable } from "./customers-table";

const PAGE_SIZE = 10;

type CustomersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePageParam(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = CustomerListQuerySchema.safeParse({
    page: value === undefined ? undefined : Number(value),
    pageSize: PAGE_SIZE,
  });
  // Garbage in the URL never crashes the page — fall back to page 1.
  return parsed.success ? parsed.data.page : 1;
}

async function CustomersView({
  searchParams,
}: {
  searchParams: CustomersPageProps["searchParams"];
}) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const isAdmin = session.user.role === "admin";

  const { items, total, pageSize } = await customersService.list({
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <CustomersTable items={items} total={total} isAdmin={isAdmin} />

      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Suspense fallback={null}>
        <CustomersView searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
