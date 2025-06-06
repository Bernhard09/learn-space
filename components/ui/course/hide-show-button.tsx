"use client";

import {
  SideMenuProps,
  useBlockNoteEditor,
  useComponentsContext,
} from "@blocknote/react";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

export function HideShowButton(props: SideMenuProps) {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;

  const block = editor.getBlock(props.block.id);
  const [isHidden, setIsHidden] = useState(false);

  const toggleHide = () => {
    if (!block) return;

    setIsHidden(!isHidden);

    // editor.updateBlock(block, {
    //   props: {
    //     ...block.props,
    //   },
    // });
  };

  return (
    <Components.SideMenu.Button
      label={isHidden ? "Unhide Block" : "Hide Block"}
      icon={isHidden ? <EyeOff /> : <Eye />}
      onClick={() => setIsHidden(!isHidden)}
    />
  );
}
