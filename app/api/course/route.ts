// app/api/course/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose'; 
import { createCourseSchema } from '@/lib/schemas';

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

export async function GET() {
    const getCookies = await cookies(); 
    const token = getCookies.get('jwt')?.value;
    const userId = await getUserIdFromToken(token);

    if (!userId) {
        return new NextResponse('Unauthorized: Invalid or missing token', { status: 401 });
    }

    try {
        const courses = await prisma.course.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(courses);
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

/**
 * Handles POST requests to create a new course.
 */
export async function POST(request: Request) {
    const getCookies = await cookies(); 
    const token = getCookies.get('jwt')?.value;
    const userId = await getUserIdFromToken(token);

    if (!userId) {
        // This will now catch expired tokens or any verification failures
        return new NextResponse('Unauthorized: Invalid or missing token', { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = createCourseSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
        }

        const { title, description, thumbnailUrl, slug } = validation.data;

        // 3. 'userId' is now correctly extracted and guaranteed to be a string
        const newCourse = await prisma.course.create({
            data: {
                title,
                slug, // Add the slug field
                description: description || null,
                thumbnailUrl: thumbnailUrl || null,
                authorId: userId, // This will no longer be undefined
                presentationBlockIds: '[]',
            }
        });

        return NextResponse.json(newCourse, { status: 201 });

    } catch (error) {
        console.error("CREATE COURSE ERROR:", error); 
        // This will catch Prisma errors specifically
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
                return new NextResponse('A course with this title already exists.', { status: 409 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
