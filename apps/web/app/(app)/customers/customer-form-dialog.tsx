"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CustomerCreate,
  type CustomerCreateInput,
  CustomerCreateSchema,
  type CustomerDto,
} from "@point-of-sale/contracts";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { FieldError } from "~/lib/form-errors";

import { createCustomerAction, updateCustomerAction } from "./actions";

type CustomerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: CustomerDto;
};

// One dialog for both add and edit; the parent controls open state and
// remounts (via key) so defaults refetch per row. The values arrive already
// normalized by the schema, so they go to the action as-is.
export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
}: CustomerFormDialogProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerCreateInput, unknown, CustomerCreate>({
    resolver: zodResolver(CustomerCreateSchema),
    defaultValues: {
      name: customer?.name ?? "",
      mobile: customer?.mobile ?? "",
      email: customer?.email ?? "",
      address: customer?.address ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = customer
      ? await updateCustomerAction({ ...values, id: customer.id })
      : await createCustomerAction(values);

    if (!result.ok) {
      if (result.fieldErrors?.mobile) {
        setError("mobile", {
          type: "server",
          message: result.fieldErrors.mobile,
        });
      } else {
        setError("root", { type: "server", message: result.message });
      }
      return;
    }

    toast.success(customer ? "Customer updated" : "Customer added");
    reset();
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit customer" : "Add customer"}
          </DialogTitle>
          <DialogDescription>
            The mobile number is the customer's identity — one number, one
            customer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="customer-name">Name</Label>
            <Input
              id="customer-name"
              autoComplete="off"
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="customer-mobile">Mobile</Label>
            <Input
              id="customer-mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              {...register("mobile")}
            />
            <FieldError message={errors.mobile?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              autoComplete="off"
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="customer-address">Address</Label>
            <Textarea id="customer-address" rows={3} {...register("address")} />
            <FieldError message={errors.address?.message} />
          </div>

          <FieldError message={errors.root?.message} />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : customer
                  ? "Save changes"
                  : "Add customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
