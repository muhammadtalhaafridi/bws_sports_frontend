import { z } from "zod";

export const emailField = z.string().trim().min(1, "Email is required").pipe(z.email("Enter a valid email"));
export const phoneField = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number");
export const passwordField = z.string().min(6, "Password must be at least 6 characters");
