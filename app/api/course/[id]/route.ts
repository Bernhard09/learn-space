// app/api/course/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { updateCourseSchema } from '@/lib/schemas';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // --- FINAL FIX: Use await on the cookies() function ---
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        const { id } = await params;

        if (!token) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        if (!userId) {
                return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
        }

        const course = await prisma.course.findFirst({
            where: { 
                id: id, 
                authorId: userId
            }, 
            include: { blocks: { orderBy: { position: 'asc' } } },
        });

        if (!course) {
            return new NextResponse('Course not found or you do not have permission', { status: 404 });
        }
        
        const document = course.blocks.map(block => JSON.parse(block.json));
        const presentationBlockIds = JSON.parse(course.presentationBlockIds || '[]');
        return NextResponse.json({ course: { ...course, document, presentationBlockIds } });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
                return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // --- FINAL FIX: Use await on the cookies() function ---
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        const { id } = await params;

        if (!token) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        if (!userId) {
            return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
        }
        
        const course = await prisma.course.findFirst({
            where: { 
                id: id, 
                authorId: userId 
            },
        });

        if (!course) {
            return new NextResponse('Forbidden: You can only edit your own courses', { status: 403 });
        }

        const body = await request.json();
        const validation = updateCourseSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.flatten(), { status: 400 });
        }
        
        const { document, presentationBlockIds } = validation.data;
        
        await prisma.$transaction(async (tx) => {
            if (document) {
                await tx.block.deleteMany({ where: { courseId: params.id } });
                await tx.block.createMany({
                    data: document.map((blockJson: any, index: number) => ({
                        id: blockJson.id,
                        json: JSON.stringify(blockJson),
                        position: index,
                        courseId: params.id,
                    })),
                });
            }
            if (presentationBlockIds !== undefined) {
                await tx.course.update({
                    where: { id: params.id },
                    data: {
                        presentationBlockIds: JSON.stringify(presentationBlockIds),
                    },
                });
            }
            });
            
            return NextResponse.json({ message: 'Course updated successfully' });
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
            return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}