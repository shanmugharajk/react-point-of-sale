import * as z from "zod";

// Feedback-only validation — better-auth revalidates on the server.
// min 8 matches its default minimum password length.
export const LoginInputSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
