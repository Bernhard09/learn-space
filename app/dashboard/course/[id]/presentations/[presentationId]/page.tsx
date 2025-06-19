'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import type { Block } from '@blocknote/core';
import { Share2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
});

// A simple component to render a read-only block
function ReadOnlyBlock({ block }: { block: Block }) {
    const editor = useCreateBlockNote({ initialContent: [block] });
    return <BlockNoteView editor={editor} editable={false} theme={'light'}/>
}

export default function Page({ params }) {
    const router = useRouter();
    const { id, presentationId }: { id: string, presentationId: string } = React.use(params);
    
    // Fetch course data to get all blocks
    const { data: courseData, error: courseError, isLoading: courseLoading } = useSWR(`/api/course/${id}`, fetcher);
    
    // Fetch presentation data
    const { data: presentation, error: presentationError, isLoading: presentationLoading } = 
        useSWR(`/api/presentation/${presentationId}`, fetcher);
    
    const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Effect to initialize the selected blocks and title once data is fetched
    useEffect(() => {
        if (presentation?.blockIds) {
            setSelectedBlockIds(new Set(presentation.blockIds));
        }
        if (presentation?.title) {
            setTitle(presentation.title);
        }
    }, [presentation]);

    // Debounced function to save the selected block IDs to the database
    const saveSelection = useDebouncedCallback(async (ids: string[]) => {
        try {
            setIsSaving(true);
            await fetch(`/api/presentation/${presentationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockIds: ids }),
            });
            toast.success("Presentation updated");
        } catch (err) {
            console.error("Failed to save presentation selection:", err);
            toast.error("Failed to update presentation");
        } finally {
            setIsSaving(false);
        }
    }, 1500); // Save 1.5 seconds after the user stops selecting

    // Function to save the title
    const saveTitle = async () => {
        if (!title.trim()) {
            toast.error("Title cannot be empty");
            return;
        }

        try {
            setIsSaving(true);
            await fetch(`/api/presentation/${presentationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            toast.success("Title updated");
        } catch (err) {
            console.error("Failed to save presentation title:", err);
            toast.error("Failed to update title");
        } finally {
            setIsSaving(false);
        }
    };

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
        const url = `${window.location.origin}/presentation/${presentationId}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success("Link copied to clipboard!");
        }).catch(err => {
            toast.error("Failed to copy link.");
            console.error('Failed to copy text: ', err);
        });
    };

    // Loading state
    if (courseLoading || presentationLoading) {
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

    // Error state
    if (courseError || presentationError) {
        return (
            <div className="p-8 text-red-500">
                <p>Error: {courseError?.message || presentationError?.message}</p>
            </div>
        );
    }

    const allBlocks: Block[] = courseData?.course?.document || [];

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-2 mb-6">
                <Link href={`/dashboard/course/${id}/presentations`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Presentation</h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
                <div className="flex-1">
                    <Label htmlFor="title" className="text-sm font-medium">
                        Presentation Title
                    </Label>
                    <div className="flex gap-2 mt-1">
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter presentation title"
                            className="flex-1"
                        />
                        <Button onClick={saveTitle} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Title'}
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleShareLink} title="Copy share link">
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                    </Button>
                    <Link href={`/dashboard/course/${id}/presentations/${presentationId}/preview`}>
                        <Button>Preview Presentation</Button>
                    </Link>
                </div>
            </div>

            <Separator className="mb-6"/>
            
            <div className="mb-4">
                <p className="text-muted-foreground">Select the blocks you want to include in your presentation.</p>
            </div>

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