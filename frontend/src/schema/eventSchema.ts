import { z } from "zod";

export const eventSchema = z.object({
  id: z.string().optional(), 

  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(35, "Title cannot exceed 15 characters")
    .refine((val) => val.trim().length > 0, "Title cannot be empty or spaces only"),

  category: z.string().nonempty("Category is required"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(100, "Description cannot exceed 100 characters")
    .refine((val) => val.trim().length > 0, "Description cannot be empty or spaces only"),

  date: z.string().nonempty("Date is required"),

  time: z.string().nonempty("Time is required"),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .refine((val) => val.trim().length > 0, "Location cannot be empty or spaces only"),

  maxAttendees: z
    .number()
    .min(1, "Max Attendees must be at least 1"),

  attendees: z
    .number()
    .min(0, "Attendees cannot be negative")
    .optional()
    .default(0),

  judges: z.array(z.string().min(1, "Judge name cannot be empty")),

  guests: z.array(z.string().min(1, "Guest name cannot be empty")),

  food: z.string(),

  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]),
});
