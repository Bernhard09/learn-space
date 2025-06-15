'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import type { Block } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';


import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch course data.');
    return res.json();
});

// A component to render the final presentation content
function PresentationView({ blocks }: { blocks: Block[] }) {
    const editor = useCreateBlockNote({ initialContent: blocks });
    return <BlockNoteView editor={editor} editable={false} theme="light" />;
}

export default function Page({ params }) {
    const router = useRouter();
    const { id } : { id: string } = React.use(params);
    
    const { data, error, isLoading } = useSWR(`/api/course/${id}`, fetcher);

    // useMemo will filter the blocks only when the data changes.
    // This is more efficient than re-filtering on every render.
    const presentationBlocks = useMemo(() => {
        if (!data?.course) return [];

        const allBlocks: Block[] = data.course.document || [];
        const selectedIds = new Set(data.course.presentationBlockIds || []);
        
        return allBlocks.filter(block => selectedIds.has(block.id));
    }, [data]);

    if (isLoading) {
        return (
            <div className="p-8 space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Separator />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }
    
    if (error) {
        return <div className="p-8 text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{data.course.title}</h1>
                    <p className="text-muted-foreground">Presentation Preview</p>
                </div>
                <Link href={`/dashboard/course/${id}/presentation`}>
                    <Button variant="outline" className="mt-4 sm:mt-0">
                        &larr; Back to Planner
                    </Button>
                </Link>
            </div>
            <Separator className="mb-6"/>

            <div className="prose prose-lg max-w-none">
                {presentationBlocks.length > 0 ? (
                    <PresentationView blocks={presentationBlocks} />
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>No blocks have been selected for this presentation yet.</p>
                        <p>Go back to the planner to select content to display here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
