import {
    DragHandleMenuProps,
    useBlockNoteEditor,
    useComponentsContext,
} from "@blocknote/react";

export function ShowBlock(props: DragHandleMenuProps) {
    const editor = useBlockNoteEditor();
    const Components = useComponentsContext()!;

    const showedBlocks = [];

    const handleShow = () => {
        const block = editor.getBlock(props.block);
        showedBlocks.push(block);
        
    }

    return (
        <Components.Generic.Menu.Item
            onClick={() => {
                editor.getBlock(props.block);
            }}
        >
            show block
        </Components.Generic.Menu.Item>
    );
}