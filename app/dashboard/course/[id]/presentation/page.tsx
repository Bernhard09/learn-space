"use client"

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { PartialBlock } from "@blocknote/core";

import styles from '@/app/presentation.module.css';
import { savePresentationIds, loadPresentationIds, loadDocument } from "@/shared/storage";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EyeIcon, Share2Icon } from "lucide-react";

function ManagerBlock({
    block,
    isChecked,
    onCheckboxChange,
} : {
    block: PartialBlock,
    isChecked: boolean,
    onCheckboxChange: () => void
}) {

    const editor = useCreateBlockNote({initialContent: [block]})

    return (
        <>
            {console.log(block)}
            <div className="flex flex-row mb-4 items-center">
                <div className="flex flex-col items-center max-h-4">
                    {/* <label> show </label> */}
                    <Checkbox 
                        checked={isChecked}
                        onCheckedChange={onCheckboxChange}
                        className="hover:cursor-pointer"
                    />
                </div>
                <div>
                    <BlockNoteView
                        className="px-8"
                        editor={editor}
                        editable={false}
                        theme={"light"}
                    />
                </div>
            </div>
        </>
    );
}


export default function Page() {
    const router = useRouter();
    const pathname = usePathname();

    const handleRoute = () => {
        router.push(`${pathname}/preview`);
    }

    const [presentationBlockIds, setPresentationBlockIds] = useState(loadPresentationIds ?? []);
    
    const editor = useCreateBlockNote({
        initialContent: loadDocument()
    });


    useEffect(() => {
        savePresentationIds(presentationBlockIds);
        console.log('Presentation IDs have been saved')
    }, [presentationBlockIds]);

    const handleCheckbox = (blockId: string) => {
        setPresentationBlockIds((prevIds) => {
            const newIds = new Set(prevIds)
            if (newIds.has(blockId)) {
                newIds.delete(blockId)
            } else {
                newIds.add(blockId)
            }
            return newIds;
        });
    }

    return (
        <>
            {console.log(presentationBlockIds)}
            <div className="py-6 px-12 w-dvw md:max-w-310">
                <div className="flex flex-row-reverse">
                    <Button
                        className="hover:cursor-pointer"
                    > 
                        <Share2Icon />
                        Share 
                    </Button>
                    <Button
                        onClick={handleRoute}
                        className="hover:cursor-pointer mr-5"
                    > 
                        <EyeIcon /> 
                        Preview 
                    </Button>
                </div>
                {editor.document.map((block) => (
                    <ManagerBlock
                        key={block.id}
                        block={block}
                        isChecked={presentationBlockIds.has(block.id)}
                        onCheckboxChange={() => handleCheckbox(block.id)}
                    />
                ))}
            </div>
        </>
    );
}