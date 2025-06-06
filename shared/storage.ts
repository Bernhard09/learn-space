import { type Block } from '@blocknote/core';

export const EDITOR_STORAGE_KEY = "blocknote-data";
export const PRESENTATION_IDS_STORAGE_KEY = "presentation-ids";

// --- Document Functions ---
export function loadDocument(): Block[] {
    if (typeof window === "undefined") {
        return [];
    }
    try {
        const saved = localStorage.getItem(EDITOR_STORAGE_KEY);
        return saved ? JSON.parse(saved) as Block[] : [{ type: "paragraph", content: "" }];
    } catch (err) {
        console.error("Failed to parse editor content:", err);
        return [];
    }
}

export function saveDocument(document: Block[]): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(document));
    }
}

// --- Presentation ID Functions ---

export function loadPresentationIds(): Set<string> {
    if (typeof window === "undefined") {
        return new Set();
    }
    try {
        const saved = localStorage.getItem(PRESENTATION_IDS_STORAGE_KEY);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (err) {
        console.error("Failed to parse presentation IDs:", err);
        return new Set();
    }
}

export function savePresentationIds(idsSet: Set<string>): void {
    if (typeof window !== "undefined") {
        // Convert Set to Array for JSON compatibility
        localStorage.setItem(PRESENTATION_IDS_STORAGE_KEY, JSON.stringify(Array.from(idsSet)));
    }
}