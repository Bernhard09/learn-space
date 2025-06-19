import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

/**
 * This is a public route that fetches the necessary data for a shared presentation.
 * It does not require any authentication.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const presentation = await prisma.presentation.findUnique({
            where: { id: params.id },
            include: {
                course: {
                    select: {
                        title: true,
                        blocks: {
                            orderBy: { position: 'asc' },
                            select: {
                                id: true,
                                json: true
                            }
                        }
                    }
                }
            }
        });

        if (!presentation) {
            return new NextResponse('Presentation not found', { status: 404 });
        }

        // Parse the blockIds from JSON string to array
        const blockIds = JSON.parse(presentation.blockIds || '[]');
        
        // Parse the blocks JSON and filter to only include blocks in the presentation
        const allBlocks = presentation.course.blocks.map(block => ({
            id: block.id,
            ...JSON.parse(block.json)
        }));

        // Return the presentation with parsed data
        return NextResponse.json({
            id: presentation.id,
            title: presentation.title,
            courseTitle: presentation.course.title,
            document: allBlocks,
            presentationBlockIds: blockIds // Keep the name for backward compatibility
        });
    } catch (error) {
        console.error('Error fetching public presentation:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}