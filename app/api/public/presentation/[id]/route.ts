import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

/**
 * This is a public route that fetches the necessary data for a shared presentation.
 * It does not require any authentication.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const course = await prisma.course.findUnique({
            where: { id: params.id },
            // We only select the fields needed for the public presentation to avoid exposing sensitive data
            select: {
                title: true,
                blocks: {
                    orderBy: { position: 'asc' },
                    select: {
                        id: true,
                        json: true
                    }
                },
                presentationBlockIds: true
            }
        });

        if (!course) {
            return new NextResponse('Presentation not found', { status: 404 });
        }

        // The blocks are stored as JSON strings, so we need to parse them.
        const document = course.blocks.map(block => JSON.parse(block.json));

        // Parse the presentationBlockIds from a string back into an array
        const presentationBlockIds = JSON.parse(course.presentationBlockIds || '[]');

        return NextResponse.json({
            title: course.title,
            document: document,
            presentationBlockIds: presentationBlockIds
        });

    } catch (error) {
        console.error('Error fetching public presentation:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}