"use server";

import {
  type ActionResult,
  CustomerCreateSchema,
  CustomerIdSchema,
  CustomerUpdateSchema,
  fieldErrorsFrom,
} from "@point-of-sale/contracts";
import {
  type Actor,
  AppError,
  customersService,
} from "@point-of-sale/services";
import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import { getSession, type Session } from "~/lib/session";

type ActionFailure = Extract<ActionResult, { ok: false }>;

const UNAUTHORIZED: ActionFailure = {
  ok: false,
  code: "unauthorized",
  message: "Please sign in again",
};

const INTERNAL: ActionFailure = {
  ok: false,
  code: "internal",
  message: "Something went wrong — try again",
};

// Transports derive the actor from the session; services enforce
// authorization against it. better-auth leaves role unset for non-admins.
function toActor(session: Session): Actor {
  return { userId: session.user.id, role: session.user.role ?? "user" };
}

// First issue becomes the message; each field keeps its own first message.
function toInvalidInput(error: ZodError): ActionFailure {
  return {
    ok: false,
    code: "invalid_input",
    message: error.issues[0]?.message ?? "Invalid input",
    fieldErrors: fieldErrorsFrom(error),
  };
}

// AppError codes stay verbatim; `field` (when present) becomes the one
// fieldError — no per-code special cases here.
function toServiceFailure(error: unknown): ActionFailure {
  if (error instanceof AppError) {
    return error.field
      ? {
          ok: false,
          code: error.code,
          message: error.message,
          fieldErrors: { [error.field]: error.message },
        }
      : { ok: false, code: error.code, message: error.message };
  }
  console.error("customer action failed:", error);
  return INTERNAL;
}

export async function createCustomerAction(
  input: unknown,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return UNAUTHORIZED;
  }

  const parsed = CustomerCreateSchema.safeParse(input);
  if (!parsed.success) {
    return toInvalidInput(parsed.error);
  }

  try {
    await customersService.create(parsed.data, toActor(session));
  } catch (error) {
    return toServiceFailure(error);
  }

  revalidatePath("/customers");
  return { ok: true };
}

export async function updateCustomerAction(
  input: unknown,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return UNAUTHORIZED;
  }

  const parsed = CustomerUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return toInvalidInput(parsed.error);
  }

  try {
    await customersService.update(parsed.data, toActor(session));
  } catch (error) {
    return toServiceFailure(error);
  }

  revalidatePath("/customers");
  return { ok: true };
}

export async function deleteCustomerAction(id: unknown): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return UNAUTHORIZED;
  }

  const parsed = CustomerIdSchema.safeParse(id);
  if (!parsed.success) {
    return toInvalidInput(parsed.error);
  }

  try {
    await customersService.remove(parsed.data, toActor(session));
  } catch (error) {
    return toServiceFailure(error);
  }

  revalidatePath("/customers");
  return { ok: true };
}
