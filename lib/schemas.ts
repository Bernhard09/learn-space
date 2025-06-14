// lib/schemas.ts
import { z } from 'zod';

// Schema for Registration
export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for Login
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// A basic schema for a Blocknote block
const blockSchema = z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.any()),
    content: z.array(z.any()),
    children: z.array(z.any()),
});

// Schema for updating a course
export const updateCourseSchema = z.object({
        document: z.array(blockSchema).optional(),
        presentationBlockIds: z.array(z.string()).optional(),
    })
    .refine(
        (data) => data.document !== undefined || data.presentationBlockIds !== undefined,
        { message: "Update data must be provided." }
    );