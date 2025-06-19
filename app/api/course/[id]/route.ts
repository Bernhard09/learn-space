// app/api/course/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { updateCourseSchema } from '@/lib/schemas';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserIdFromToken(tokenValue: string | undefined): Promise<string | null> {
    if (!tokenValue) return null;
    try {
        const decoded = await jwtVerify(tokenValue, secret);
        const userId = decoded.payload.userId as string;
        return userId;
    } catch (error) {
        return null;
    }
}


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        const { id } = await params;

        if (!token) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        // Use the getUserIdFromToken function for consistent token verification
        const userId = await getUserIdFromToken(token);

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
        console.log('PUT request received for course update');
        
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        console.log('Extracting ID from params');
        const { id } = await params;
        console.log('Course ID:', id);

        if (!token) {
            console.log('No JWT token found');
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        // Use the getUserIdFromToken function for consistent token verification
        console.log('Verifying token and extracting user ID');
        const userId = await getUserIdFromToken(token);

        if (!userId) {
            console.log('Invalid token or user ID not found');
            return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
        }
        console.log('User ID:', userId);
        
        console.log('Finding course in database');
        const course = await prisma.course.findFirst({
            where: { 
                id: id, 
                authorId: userId 
            },
        });

        if (!course) {
            console.log('Course not found or user not authorized');
            return new NextResponse('Forbidden: You can only edit your own courses', { status: 403 });
        }
        console.log('Course found:', course.id);

        console.log('Parsing request body');
        const body = await request.json();
        console.log('Request body received:', JSON.stringify(body).substring(0, 100) + '...');
        
        console.log('Validating request body against schema');
        const validation = updateCourseSchema.safeParse(body);
        if (!validation.success) {
            console.log('Validation failed:', validation.error.flatten());
            return NextResponse.json(validation.error.flatten(), { status: 400 });
        }
        console.log('Validation successful');
        
        const { document, presentationBlockIds } = validation.data;
        
        console.log('Starting database transaction');
        try {
            await prisma.$transaction(async (tx) => {
                if (document) {
                    console.log(`Deleting existing blocks for course ID: ${id}`);
                    await tx.block.deleteMany({ where: { courseId: id } });
                    
                    console.log(`Creating ${document.length} new blocks`);
                    // Create blocks one by one instead of using createMany to avoid unique constraint errors
                    for (let index = 0; index < document.length; index++) {
                        const blockJson = document[index];
                        console.log(`Processing block ${index + 1}/${document.length}, ID: ${blockJson.id}`);
    
                        await tx.block.create({
                            data: {
                                json: JSON.stringify(blockJson),
                                position: index,
                                courseId: id,
                            }
                        });
                    }
                    console.log('Blocks created successfully');
                }
                
                // Always update presentationBlockIds 
                const blockIdsToSave = presentationBlockIds !== undefined ? presentationBlockIds : [];
                console.log(`Updating presentation block IDs for course ID: ${id}`);
                await tx.course.update({
                    where: { id: id },
                    data: {
                        presentationBlockIds: JSON.stringify(blockIdsToSave),
                    },
                });
                console.log('Presentation block IDs updated successfully');
                
                console.log('Transaction completed successfully');
            });
        } catch (txError) {
            console.error('Transaction error:', txError);
            throw txError;
        }
        
        console.log('Course updated successfully, sending response');
        return NextResponse.json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error('Error in PUT request:', error);
        
        if (error instanceof jwt.JsonWebTokenError) {
            console.log('JWT token error:', error.message);
            return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
        }
        
        // Log error information
        console.error('Internal server error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : 'Unknown error'
        });
        
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}