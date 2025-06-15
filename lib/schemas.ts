// lib/schemas.ts
import { z } from 'zod';

// ... (registerSchema and loginSchema remain the same)
export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const blockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.any()),
  content: z.array(z.any()),
  children: z.array(z.any()),
});

export const updateCourseSchema = z
  .object({
    document: z.array(blockSchema).optional(),
    presentationBlockIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => data.document !== undefined || data.presentationBlockIds !== undefined,
    { message: "At least one field (document or presentationBlockIds) must be provided for an update." }
  );

// UPDATE the createCourseSchema
export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(100),
  description: z.string().optional(),
  thumbnailUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});
