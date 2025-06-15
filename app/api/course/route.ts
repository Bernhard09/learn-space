// app/api/course/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createCourseSchema } from '@/lib/schemas';

const prisma = new PrismaClient();

// The GET function remains the same
export async function GET() {
    try {
        const getCookies = await cookies();
        const token = await getCookies.get('jwt')?.value;
        if (!token) return new NextResponse('Unauthorized', { status: 401 });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        const courses = await prisma.course.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(courses);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

/**
 * Handles POST requests to create a new course.
 */
export async function POST(request: Request) {
    try {
        const getCookies = await cookies();
        const token = await getCookies.get('jwt')?.value;
        if (!token) return new NextResponse('Unauthorized', { status: 401 });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        const body = await request.json();
        const validation = createCourseSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
        }

        const { title, description, thumbnailUrl } = validation.data;

        // --- THE FIX: Convert empty strings to null before saving ---
        const newCourse = await prisma.course.create({
            data: {
                title,
                // If description is an empty string, save it as null, otherwise save the value.
                description: description || null, 
                // If thumbnailUrl is an empty string, save it as null, otherwise save the value.
                thumbnailUrl: thumbnailUrl || null, 
                authorId: userId,
                presentationBlockIds: '[]',
            }
        });

        return NextResponse.json(newCourse, { status: 201 });

    } catch (error) {
        console.error("CREATE COURSE ERROR:", error); // Added for better debugging
        if (error instanceof jwt.JsonWebTokenError) {
          return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
