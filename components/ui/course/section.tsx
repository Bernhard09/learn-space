"use client";

import React, { useRef, useEffect } from "react";

export default function SectionComponent({
    id, 
    type, 
    content,
    onUpdate,
}: {
    id: string,
    type: 'text' | 'image' | 'link' | 'code',
    content?: string
    onUpdate?: (id: string, content: string) => void
}) {

    const divRef = useRef<HTMLDivElement>(null);
    const lastSelectionRef = useRef<Range | null>(null);

    const saveCursorPosition = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            lastSelectionRef.current = selection.getRangeAt(0);
        }
    };

    const restoreCursorPosition = () => {
        const selection = window.getSelection();
        const el = divRef.current;
        if (selection && lastSelectionRef.current && el?.contains(lastSelectionRef.current.startContainer)) {
            selection.removeAllRanges();
            selection.addRange(lastSelectionRef.current);
        }
    }

    useEffect(() => {
        const el = divRef.current;
        if (!el) return;
        if (el.innerHTML !== content?.replace(/\n/g, '<br>')) {
            el.innerHTML = content?.replace(/\n/g, '<br>') || "";
            restoreCursorPosition();
        }
    }, [content]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        saveCursorPosition();
        const html = e.currentTarget.innerHTML;
        const text = html.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ');
        if(onUpdate) onUpdate(id, text);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);

            const br = document.createElement('br');
            const space = document.createTextNode('\u200B'); // Zero-width space

            range.deleteContents();
            range.insertNode(br);
            range.collapse(false);
            range.insertNode(space);

            const newRange = document.createRange();
            newRange.setStartAfter(space);
            newRange.setEndAfter(space);
            selection.removeAllRanges();
            selection.addRange(newRange);

            saveCursorPosition();
        }

    }

    return (
        <div>
            <div className="border border-[#d9d9d9] whitespace-pre-wrap word-break-words rounded-md min-h-14 my-4 p-4"
                contentEditable={true}
                suppressContentEditableWarning={true}
                ref={divRef}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onMouseUp={saveCursorPosition}
                onKeyUp={saveCursorPosition}
            >
                {/* {content} */}
            </div>
        </div>
    );
}