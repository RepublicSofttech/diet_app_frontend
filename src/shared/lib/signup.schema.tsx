import { z } from "zod";

export const signupSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  // 🔒 hidden system fields (NOT in UI)
  age: z.number().default(0),
  gender: z.string().default(""),
  height_cm: z.number().default(0),
  weight_kg: z.number().default(0),
  activity_level: z.string().default(""),
  dietary_preferences: z.string().default(""),
  allergies: z.string().default(""),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
