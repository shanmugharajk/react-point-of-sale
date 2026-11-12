import * as z from "zod";

function normalizeMobile(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

// The mobile IS the customer identity (D24/D25): one active customer per
// number. People type it with spaces or hyphens — normalize first, then
// validate, so every layer accepts the same input.
const MobileSchema = z
  .string({ error: "Mobile number is required" })
  .transform(normalizeMobile)
  .pipe(
    z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  );

// An empty field means "not provided" — keep it out of the database.
const OptionalEmailSchema = z
  .union([z.email("Enter a valid email address"), z.literal("")])
  .transform((value) => (value === "" ? undefined : value));

export const CustomerCreateSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  mobile: MobileSchema,
  email: OptionalEmailSchema.optional(),
  address: z
    .string()
    .trim()
    .max(200, "Address must be 200 characters or fewer")
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
});

export const CustomerIdSchema = z.uuid("Invalid customer id");

export const CustomerUpdateSchema = CustomerCreateSchema.extend({
  id: CustomerIdSchema,
});

export const CustomerListQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

// Input types describe what forms send; the parsed types what services
// accept. Keeping both explicit means the form fields stay strings.
export type CustomerCreateInput = z.input<typeof CustomerCreateSchema>;
export type CustomerUpdateInput = z.input<typeof CustomerUpdateSchema>;
export type CustomerCreate = z.output<typeof CustomerCreateSchema>;
export type CustomerUpdate = z.output<typeof CustomerUpdateSchema>;
export type CustomerListQuery = z.infer<typeof CustomerListQuerySchema>;

// The row the UI receives — dates stay Date objects; the UI formats them.
export type CustomerDto = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  address: string | null;
  createdAt: Date;
};

export type CustomerListResult = {
  items: CustomerDto[];
  total: number;
  page: number;
  pageSize: number;
};
