// app/api/course/slug/[slug]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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

export async function GET(request: Request, { params }: { params: { title: string } }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        const { title } = await params;

        if (!token) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const course = await prisma.course.findFirst({
            where: { 
                slug: title, 
                // authorId: userId
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
        if (error instanceof Error) {
            return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// export async function PUT(request: Request, { params }: { params: { slug: string } }) {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get('jwt')?.value;

//         const { slug } = await params;

//         if (!token) {
//             return new NextResponse('Unauthorized', { status: 401 });
//         }
        
//         // Use the getUserIdFromToken function for consistent token verification
//         const userId = await getUserIdFromToken(token);

//         if (!userId) {
//             return new NextResponse('Unauthorized: Invalid Token', { status: 401 });
//         }
        
//         const course = await prisma.course.findFirst({
//             where: { 
//                 slug: slug, 
//                 authorId: userId 
//             },
//         });

//         if (!course) {
//             return new NextResponse('Forbidden: You can only edit your own courses', { status: 403 });
//         }

//         const body = await request.json();
        
//         const validation = updateCourseSchema.safeParse(body);
//         if (!validation.success) {
//             return NextResponse.json(validation.error.flatten(), { status: 400 });
//         }
        
//         const { document, presentationBlockIds } = validation.data;
        
//         try {
//             await prisma.$transaction(async (tx) => {
//                 if (document) {
//                     await tx.block.deleteMany({ where: { courseId: course.id } });
                    
//                     for (let index = 0; index < document.length; index++) {
//                         const blockJson = document[index];
//                         await tx.block.create({
//                             data: {
//                                 json: JSON.stringify(blockJson),
//                                 position: index,
//                                 courseId: course.id,
//                             }
//                         });
//                     }
//                 }
                
//                 const blockIdsToSave = presentationBlockIds !== undefined ? presentationBlockIds : [];
//                 await tx.course.update({
//                     where: { id: course.id },
//                     data: {
//                         presentationBlockIds: JSON.stringify(blockIdsToSave),
//                     },
//                 });
//             });
//         } catch (txError) {
//             throw txError;
//         }
        
//         return NextResponse.json({ message: 'Course updated successfully' });
//     } catch (error) {
//         if (error instanceof Error) {
//             return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
//         }
//         return new NextResponse('Internal Server Error', { status: 500 });
//     }
// }