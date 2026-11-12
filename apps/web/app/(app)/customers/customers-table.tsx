"use client";

import type { CustomerDto } from "@point-of-sale/contracts";
import { Ellipsis } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { CustomerDeleteDialog } from "./customer-delete-dialog";
import { CustomerFormDialog } from "./customer-form-dialog";

type CustomersTableProps = {
  items: CustomerDto[];
  total: number;
  isAdmin: boolean;
};

// The shop is IST (D48) — format dates in Asia/Kolkata, no new dependency.
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
});

export function CustomersTable({ items, total, isAdmin }: CustomersTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerDto | null>(null);
  const [deleting, setDeleting] = useState<CustomerDto | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (customer: CustomerDto) => {
    setEditing(customer);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "customer" : "customers"}
          </p>
        </div>
        <Button type="button" onClick={openAdd}>
          Add customer
        </Button>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center gap-1 py-16 text-center">
          <p className="text-sm text-muted-foreground">No customers yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first customer to start tracking credit.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead>Added</TableHead>
              {isAdmin && (
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {customer.email ?? "—"}
                </TableCell>
                <TableCell className="hidden max-w-48 truncate md:table-cell">
                  {customer.address ?? "—"}
                </TableCell>
                <TableCell>
                  {dateFormatter.format(customer.createdAt)}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${customer.name}`}
                          />
                        }
                      >
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(customer)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleting(customer)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CustomerFormDialog
        // Remount per target so the form re-fills its defaults.
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={editing ?? undefined}
      />
      {deleting && (
        <CustomerDeleteDialog
          customer={deleting}
          open
          onOpenChange={(next) => {
            if (!next) {
              setDeleting(null);
            }
          }}
        />
      )}
    </>
  );
}
