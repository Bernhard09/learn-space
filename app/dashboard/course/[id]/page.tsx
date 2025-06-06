"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import {
  useCreateBlockNote,
  SideMenuController,
  SideMenu,
  AddBlockButton,
  DragHandleButton,
} from "@blocknote/react";

import { useEffect} from "react";
import { loadDocument, saveDocument } from "@/shared/storage";

export default function Page() {
  const editor = useCreateBlockNote({
    initialContent: loadDocument(),
    trailingBlock: false,
  });
  

  // Save to localStorage on change
  useEffect(() => {
    const interval = setInterval(() => {
      saveDocument(editor.document);
    }, 1000);
    console.log("Saved")
    console.log("BlockNote Editor Instance:", editor);
    console.log("BlockNote value: ", editor.document)
    console.log("BlockNote value from storage: ", loadDocument())

    return () => clearInterval(interval);
  }, [editor]);

  return (
    <>
      <div className="flex flex-row-reverse  w-6xl ">
        {/* <PresentationIcon onClick={handleRoute} /> */}
      </div>
      <BlockNoteView
        className="px-8"
        editor={editor}
        theme="light"
        sideMenu={false}
      >

        <SideMenuController
          sideMenu={(props) => (
            <SideMenu {...props} >
              <AddBlockButton {...props} />
              <DragHandleButton {...props} />
            </SideMenu>
          )}
        />
      </BlockNoteView>
    </>
  );
}
