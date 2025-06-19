// app/api/presentation/[id]/route.ts
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

// Schema for updating a presentation
const updatePresentationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(100).optional(),
    blockIds: z.array(z.string()).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update."
});

/**
 * GET - Retrieves a specific presentation by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const getCookies = await cookies();
    const token = getCookies.get('jwt')?.value;
    const userId = await getUserIdFromToken(token);

    if (!userId) {
        return new NextResponse('Unauthorized: Invalid or missing token', { status: 401 });
    }

    try {
        const { id } = params;
        
        // Get the presentation with course information to verify ownership
        const presentation = await prisma.presentation.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        authorId: true,
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

        // Verify the user owns the course this presentation belongs to
        if (presentation.course.authorId !== userId) {
            return new NextResponse('You do not have permission to view this presentation', { status: 403 });
        }

        // Parse the blockIds from JSON string to array
        const blockIds = JSON.parse(presentation.blockIds || '[]');
        
        // Parse the blocks JSON
        const blocks = presentation.course.blocks.map(block => ({
            id: block.id,
            ...JSON.parse(block.json)
        }));

        // Return the presentation with parsed data
        return NextResponse.json({
            ...presentation,
            blockIds,
            blocks
        });
    } catch (error) {
        console.error("GET PRESENTATION ERROR:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

/**
 * PUT - Updates a specific presentation
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const getCookies = await cookies();
    const token = getCookies.get('jwt')?.value;
    const userId = await getUserIdFromToken(token);

    if (!userId) {
        return new NextResponse('Unauthorized: Invalid or missing token', { status: 401 });
    }

    try {
        const { id } = params;
        const body = await request.json();
        
        // Validate the request body
        const validation = updatePresentationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
        }

        // Get the presentation to verify ownership
        const presentation = await prisma.presentation.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        authorId: true
                    }
                }
            }
        });

        if (!presentation) {
            return new NextResponse('Presentation not found', { status: 404 });
        }

        // Verify the user owns the course this presentation belongs to
        if (presentation.course.authorId !== userId) {
            return new NextResponse('You do not have permission to update this presentation', { status: 403 });
        }

        const { title, blockIds } = validation.data;
        
        // Prepare the update data
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (blockIds !== undefined) updateData.blockIds = JSON.stringify(blockIds);

        // Update the presentation
        const updatedPresentation = await prisma.presentation.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updatedPresentation);
    } catch (error) {
        console.error("UPDATE PRESENTATION ERROR:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

/**
 * DELETE - Deletes a specific presentation
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const getCookies = await cookies();
    const token = getCookies.get('jwt')?.value;
    const userId = await getUserIdFromToken(token);

    if (!userId) {
        return new NextResponse('Unauthorized: Invalid or missing token', { status: 401 });
    }

    try {
        const { id } = params;
        
        // Get the presentation to verify ownership
        const presentation = await prisma.presentation.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        authorId: true
                    }
                }
            }
        });

        if (!presentation) {
            return new NextResponse('Presentation not found', { status: 404 });
        }

        // Verify the user owns the course this presentation belongs to
        if (presentation.course.authorId !== userId) {
            return new NextResponse('You do not have permission to delete this presentation', { status: 403 });
        }

        // Delete the presentation
        await prisma.presentation.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("DELETE PRESENTATION ERROR:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}