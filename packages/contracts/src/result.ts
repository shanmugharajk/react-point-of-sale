import type { ZodError } from "zod";

// What server actions return to the client. `code` is an OPEN set —
// transports translate AppError codes into it verbatim; never a closed union.
export type ActionResult =
  | { ok: true }
  | {
      ok: false;
      code: string;
      message: string;
      fieldErrors?: Record<string, string>;
    };

// First message per field — the shape forms want when placing errors. It
// lives beside ActionResult so every transport flattens issues the same way.
export function fieldErrorsFrom(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (field !== "" && !(field in fieldErrors)) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}
