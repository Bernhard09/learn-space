"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import { loadDocument, loadPresentationIds } from "@/shared/storage";

export default function Page() {
    const router = useRouter();
    const presentationBlockIds = loadPresentationIds();
    const previewBlocks = loadDocument().filter((block) => presentationBlockIds.has(block.id))
    const editor = useCreateBlockNote({
        initialContent: previewBlocks
    });

    const handleRoute = () => {
        router.back();
    }

    return (
        <>
            <Button onClick={handleRoute} className="hover:cursor-pointer max-w-fit">
                <ArrowLeft />
                Back
            </Button>
            <BlockNoteView
                className="px-8"
                editor={editor}
                editable={false}
                theme={"light"}
            />
        </>
    );
}