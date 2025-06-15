'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import type { Block } from '@blocknote/core';
// Import useCreateBlockNote instead of useBlockNote
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import React from 'react';

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) {
        throw new Error('Failed to fetch course data.');
    }
    return res.json();
});

/**
 * A new component for the editor itself.
 * This ensures that `useCreateBlockNote` is only called once the initial content is available.
 */
function Editor({ initialContent, onSave }: { initialContent: Block[], onSave: (document: Block[]) => void }) {
    // 1. Initialize the editor with useCreateBlockNote, using the initial content prop
    const editor = useCreateBlockNote({ initialContent });


    const debouncedSave = useDebouncedCallback((document: Block[]) => {
        onSave(document);
    }, 1500);

    return (
        <BlockNoteView
            editor={editor}
            theme="light"
            // 3. Use the `onChange` prop of the view to trigger the debounced save
            onChange={() => {
                debouncedSave(editor.document);
            }}
            className='w-full mt-4'
        />
    );
}

export default function Page({ params }) {
    
    const { id } : { id: string } = React.use(params);
    const router = useRouter();
    const { data, error, isLoading } = useSWR(`/api/course/${id}`, fetcher);

    // This function will be passed as a prop to the Editor component
    const handleSave = async (document: Block[]) => {
        try {
            await fetch(`/api/course/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document }),
            });
        } catch (err) {
            console.error("Failed to save document:", err);
        }
    };

    // Handle loading and error states
    if (isLoading || !data) {
        return (
            <div className="p-8 space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-5/6" />
                <Skeleton className="h-8 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-500">
                <p>Error loading course.</p>
                <p>{error.message}</p>
                <button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // Default block to provide if a new course has no content yet.
    // This prevents the "initialContent must be a non-empty array" error.
    const defaultInitialContent: Block[] = [
      {
        id: "initial-block",
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [],
        children: [],
      },
    ];

    // Check if the fetched document is empty. If so, use the default content.
    const initialContent = 
        data.course.document && data.course.document.length > 0
            ? data.course.document
            : defaultInitialContent;
    
    // Render the editor component only when the data is ready
    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">{data.course.title}</h1>
            <Separator />
            <Editor
                
                initialContent={initialContent}
                onSave={handleSave}
            />
        </div>
    );
}