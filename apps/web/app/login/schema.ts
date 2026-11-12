import * as z from "zod";

// Feedback-only — better-auth revalidates; min 8 matches its default.
export const LoginInputSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
