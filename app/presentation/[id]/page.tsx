'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';
import type { Block } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Could not fetch the presentation.');
    return res.json();
});

function PresentationView({ blocks }: { blocks: Block[] }) {
    const editor = useCreateBlockNote({ initialContent: blocks });
    return <BlockNoteView editor={editor} editable={false} theme="light" />;
}

export default function Page({ params }) {
    const { id }: { id: string } = React.use(params);
    const { data, error, isLoading } = useSWR(`/api/public/presentation/${id}`, fetcher, {
        refreshInterval: 5000, // Auto-refresh every 5 seconds 
        revalidateOnFocus: true, // Also refresh when the window regains focus
        dedupingInterval: 2000, // Reduce deduping interval for more frequent checks
    });

    const presentationBlocks = useMemo(() => {
        if (!data) return [];
        const allBlocks: Block[] = data.document || [];
        const selectedIds = new Set(data.presentationBlockIds || []);
        return allBlocks.filter(block => selectedIds.has(block.id));
    }, [data]);

    if (isLoading) {
        return (
            <main className="container mx-auto max-w-4xl p-8">
                <Skeleton className="h-12 w-3/4 mb-6" />
                <Separator />
                <div className="space-y-4 mt-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </main>
        );
    }
    
    if (error) {
        return (
            <main className="container mx-auto max-w-4xl p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Presentation Not Found</h1>
                <p className="text-muted-foreground">{error.message}</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto max-w-4xl p-4 md:p-8">
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-bold">{data.title}</h1>
                <p className="text-muted-foreground mt-2">A presentation from {data.courseTitle}</p>
            </header>
            <Separator className="mb-8"/>
            <div className="prose prose-lg max-w-none">
                {presentationBlocks.length > 0 ? (
                    <PresentationView 
                        key={JSON.stringify(presentationBlocks.map(b => b.id))} 
                        blocks={presentationBlocks} 
                    />
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>This presentation doesn't have any content selected yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
