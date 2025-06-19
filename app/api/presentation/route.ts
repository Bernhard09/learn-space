// app/api/presentation/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { z } from 'zod';

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper function to get userId from token to avoid repetition
async function getUserIdFromToken(tokenValue: string | undefined): Promise<string | null> {
    if (!tokenValue) return null;
    try {
        const decoded = await jwtVerify(tokenValue, secret);
        const userId = decoded.payload.userId as string;
        return userId;
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return null;
    }
}

// Schema for creating a presentation
const createPresentationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(100),
    courseId: z.string(),
    blockIds: z.array(z.string()).optional(),
});

// Schema for updating a presentation
const updatePresentationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(100).optional(),
    blockIds: z.array(z.string()).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update."
});

/**
 * GET - Retrieves all presentations for the authenticated user
 */
export async function GET(request: Request) {
    const getCookies = await cookies();
    const token = getCookies.get('jwt')?.value;
    const userId = await getUserIdFromToken(token);

    if (!userId) {
        return new NextResponse('Unauthorized: Invalid or missing token', { status: 401 });
    }

    // Get the courseId from the query parameters if provided
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');

    try {
        // If courseId is provided, get presentations for that course only
        if (courseId) {
            // First verify the user owns this course
            const course = await prisma.course.findFirst({
                where: { 
                    id: courseId,
                    authorId: userId
                }
            });

            if (!course) {
                return new NextResponse('Course not found or you do not have permission', { status: 404 });
            }

            const presentations = await prisma.presentation.findMany({
                where: { courseId },
                orderBy: { createdAt: 'desc' },
            });
            
            return NextResponse.json(presentations);
        } 
        
        // Otherwise, get all presentations for courses owned by the user
        const presentations = await prisma.presentation.findMany({
            where: {
                course: {
                    authorId: userId
                }
            },
            include: {
                course: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        
        return NextResponse.json(presentations);
    } catch (error) {
        console.error("GET PRESENTATIONS ERROR:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

/**
 * POST - Creates a new presentation
 */
export async function POST(request: Request) {
    const getCookies = await cookies();
    const token = getCookies.get('jwt')?.value;
    const userId = await getUserIdFromToken(token);

    if (!userId) {
        return new NextResponse('Unauthorized: Invalid or missing token', { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = createPresentationSchema.safeParse(body);
        
        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
        }

        const { title, courseId, blockIds = [] } = validation.data;

        // Verify the user owns this course
        const course = await prisma.course.findFirst({
            where: { 
                id: courseId,
                authorId: userId
            }
        });

        if (!course) {
            return new NextResponse('Course not found or you do not have permission', { status: 404 });
        }

        // Create the new presentation
        const newPresentation = await prisma.presentation.create({
            data: {
                title,
                courseId,
                blockIds: JSON.stringify(blockIds),
            }
        });

        return NextResponse.json(newPresentation, { status: 201 });
    } catch (error) {
        console.error("CREATE PRESENTATION ERROR:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}