// Services throw this; transports map `code` into ActionResult. Codes are an
// OPEN set — never a closed union. `field`, when set, names the input field
// the error belongs to, so transports can place the message without knowing
// individual codes.
export class AppError extends Error {
  readonly code: string;
  readonly field?: string;

  constructor(code: string, message: string, options?: { field?: string }) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.field = options?.field;
  }
}
