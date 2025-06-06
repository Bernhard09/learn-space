"use client"

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { 
    useCreateBlockNote, 
    SideMenuController,
    SideMenu,
    AddBlockButton,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { getInitialContent } from "../../[id]/page";
import { HideShowButton } from "@/components/ui/course/hide-show-button";
import { BlockSchema, PartialBlock } from "@blocknote/core";

import styles from '@/app/presentation.module.css';

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
        <div className={styles.managerBlock}>
            <div className={styles.managerBlockControls}>
                <input
                    title="include to presentation" 
                    type="checkbox"
                    checked={isChecked}
                    onChange={onCheckboxChange}
                />
                <label>Include in presentation</label>
            </div>
            <div className={styles.managerBlockContent}>
                <BlockNoteView
                    className="px-8"
                    editor={editor}
                    editable={false}
                    theme={"light"}
                    sideMenu={false}
                >
                    <SideMenuController
                        sideMenu={(props) => (
                            <div className="pr-4">
                                <SideMenu {...props}>
                                    {/* <AddBlockButton {...props} /> */}
                                {/* <DragHandleButton {...props} /> */}
                                </SideMenu>
                            </div>
                    )}
                />
                </BlockNoteView>  
            </div>
        </div>
    );
}


export default function Page() {
    const router = useRouter();
    const handleRoute = () => {
        router.back();
    }

    const initialDocument = useMemo(() => getInitialContent, [])
    // const [presentationBlockIds, setPresentationBlockIds] = useState(getInitialContent);
    
    const editor = useCreateBlockNote({
        initialContent: getInitialContent()
    });

    const handleCheckbox = (blockId: string) => {

    }

    return (
        <>
            <div className="flex flex-row justify-between items-center w-full p-4 bg-gray-50 border-b">
                <div className="w-full h-[calc(100vh-65px)] overflow-y-auto p-8 bg-gray-50">
                    <div>
                        {editor.document.map((block) => (
                        <ManagerBlock
                            key={block.id}
                            block={block}
                            isChecked={false}
                            onCheckboxChange={() => handleCheckbox(block.id)}
                        />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}