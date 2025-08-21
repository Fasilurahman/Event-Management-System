import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 3 characters")
    .max(15, "Name cannot exceed 15 characters")
    .refine((val) => val.trim().length > 0, "Name cannot be empty or spaces only"),
  
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  
  confirmPassword: z.string().nonempty("Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
