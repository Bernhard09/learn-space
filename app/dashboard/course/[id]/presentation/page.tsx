'use client';

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import type { Block } from '@blocknote/core';
import { Share2 } from 'lucide-react';
import { toast } from "sonner";

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator'
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch course data.');
    return res.json();
});

// A simple component to render a read-only block
function ReadOnlyBlock({ block }: { block: Block }) {
    const editor = useCreateBlockNote({ initialContent: [block] });
    return <BlockNoteView editor={editor} editable={false} theme={'light'}/>;
}

export default function Page({ params } ) {
    const router = useRouter();
    const { id } : { id: string } = React.use(params);
    const { data, error, isLoading } = useSWR(`/api/course/${id}`, fetcher);

    const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());

    // Effect to initialize the selected blocks once data is fetched
    useEffect(() => {
        if (data?.course?.presentationBlockIds) {
            setSelectedBlockIds(new Set(data.course.presentationBlockIds));
        }
    }, [data]);

    // Debounced function to save the selected block IDs to the database
    const saveSelection = useDebouncedCallback(async (ids: string[]) => {
        try {
            await fetch(`/api/course/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ presentationBlockIds: ids }),
            });
        } catch (err) {
            console.error("Failed to save presentation selection:", err);
        }
    }, 1500); // Save 1.5 seconds after the user stops selecting

    const handleCheckboxChange = (blockId: string, checked: boolean) => {
        const newSelection = new Set(selectedBlockIds);
        if (checked) {
            newSelection.add(blockId);
        } else {
            newSelection.delete(blockId);
        }
        setSelectedBlockIds(newSelection);
        saveSelection(Array.from(newSelection)); // Trigger the debounced save
    };

    const handleShareLink = () => {
        const url = `${window.location.origin}/presentation/${id}`;
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
                <Skeleton className="h-8 w-1/2" />
                <Separator />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }
    
    if (error) {
        return <div className="p-8 text-red-500">Error: {error.message}</div>;
    }

    const allBlocks: Block[] = data?.course?.document || [];

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Presentation Planner</h1>
                    <p className="text-muted-foreground">Select the blocks you want to include in your presentation.</p>
                </div>
<div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="icon" onClick={handleShareLink} title="Copy share link">
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                    </Button>
                    <Link href={`/dashboard/course/${id}/presentation/preview`}>
                        <Button>Preview Presentation</Button>
                    </Link>
                </div>
            </div>
            <Separator className="mb-6"/>

            <div className="space-y-4">
                {allBlocks.map((block) => (
                    <div key={block.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                            id={`checkbox-${block.id}`}
                            checked={selectedBlockIds.has(block.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(block.id, !!checked)}
                            className="mt-2"
                        />
                        <Label htmlFor={`checkbox-${block.id}`} className="flex-1 cursor-pointer">
                            <ReadOnlyBlock block={block} />
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}
