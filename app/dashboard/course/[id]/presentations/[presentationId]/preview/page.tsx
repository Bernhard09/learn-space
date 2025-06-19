'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import type { Block } from '@blocknote/core';
import { ArrowLeft, Share2 } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
});

function PresentationView({ blocks }: { blocks: Block[] }) {
    const editor = useCreateBlockNote({ initialContent: blocks });
    return <BlockNoteView editor={editor} editable={false} theme="light" />;
}

export default function PreviewPresentationPage({ params }) {
    const router = useRouter();
    const { id, presentationId }: { id: string, presentationId: string } = React.use(params);
    
    // Fetch presentation data
    const { data, error, isLoading } = useSWR(`/api/presentation/${presentationId}`, fetcher);

    // Filter blocks to only include those selected for the presentation
    const presentationBlocks = useMemo(() => {
        if (!data) return [];
        
        const allBlocks: Block[] = data.blocks || [];
        const selectedIds = new Set(data.blockIds || []);
        
        return allBlocks.filter(block => selectedIds.has(block.id));
    }, [data]);

    const handleShareLink = () => {
        const url = `${window.location.origin}/presentation/${presentationId}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success("Link copied to clipboard!");
        }).catch(err => {
            toast.error("Failed to copy link.");
            console.error('Failed to copy text: ', err);
        });
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Separator />
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
                <div className="flex items-center gap-2">
                    <Link href={`/dashboard/course/${id}/presentations/${presentationId}`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                        <p className="text-muted-foreground">Preview Mode</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    className="mt-4 sm:mt-0 flex items-center gap-2"
                    onClick={handleShareLink}
                >
                    <Share2 className="h-4 w-4" />
                    Share Presentation
                </Button>
            </div>
            
            <Separator className="mb-8"/>
            
            <div className="prose prose-lg max-w-none">
                {presentationBlocks.length > 0 ? (
                    <PresentationView blocks={presentationBlocks} />
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>This presentation doesn't have any content selected yet.</p>
                        <Link href={`/dashboard/course/${id}/presentations/${presentationId}`}>
                            <Button variant="outline" className="mt-4">
                                Select Content
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}