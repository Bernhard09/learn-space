'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import type { Block } from '@blocknote/core';

// Import BlockNote components and styles
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
    PDFExporter,
    pdfDefaultSchemaMappings,
} from "@blocknote/xl-pdf-exporter";
import * as ReactPDF from "@react-pdf/renderer";

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';



import React from 'react';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) {
        throw new Error('Failed to fetch course data.');
    }
    return res.json();
});

function Editor({ 
    initialContent,
    title, 
    onSave 
} : { 
    initialContent: Block[],
    title: string, 
    onSave: (document: Block[]) => void 
}) {
    
    const editor = useCreateBlockNote({ initialContent });


    const debouncedSave = useDebouncedCallback((document: Block[]) => {
        onSave(document);
    }, 1500);
    
    const handleExportToPDF = async () => {
        try {
            const pdfExporter = new PDFExporter(editor.schema, pdfDefaultSchemaMappings);
            // Convert the blocks to a react-pdf document
            const pdfDocument = await pdfExporter.toReactPDFDocument(editor.document);
            // Use react-pdf to generate a blob and download it
            const blob = await ReactPDF.pdf(pdfDocument).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title || 'document'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        }
    }

    return (
        <>
            <Button className='mb-3' onClick={handleExportToPDF}>Export to PDF</Button>
            <Separator />
            <BlockNoteView
                editor={editor}
                theme="light"
                // 3. Use the `onChange` prop of the view to trigger the debounced save
                onChange={() => {
                    debouncedSave(editor.document);
                }}
                className='w-full mt-4'
            />
        </>
    );
}

export default function Page({ params }) {

    
    const { id } : { id: string } = React.use(params);
    const router = useRouter();
    const { data, error, isLoading } = useSWR(`/api/course/${id}`, fetcher);

    // This function will be passed as a prop to the Editor component
    const handleSave = async (document: Block[]) => {
        try {
            console.log('Saving document:', document);
            // Include the current presentationBlockIds from the data if available
            const presentationBlockIds = data.course.presentationBlockIds || [];
            
            const response = await fetch(`/api/course/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    document,
                    presentationBlockIds 
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error(`Error ${response.status}: ${errorData}`);
                throw new Error(`Failed to save: ${response.status} ${errorData}`);
            }
            
            console.log('Document saved successfully');
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
            <div className="flex flex-row items-center justify-between mb-6">
                <h1 className="text-4xl font-bold mb-8">{data.course.title}</h1>
            </div>
            
            <Editor
                initialContent={initialContent}
                title={data.course.title}
                onSave={handleSave}
            />
        </div>
    );
}