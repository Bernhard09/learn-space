import { Plus } from "lucide-react";

export default function AddSectionButton({
    position = 0,
    onClick
}: {
    position?: number
    onClick?: (position: number) => void
}) { 
    const localOnClick = onClick?.bind(null,position);
    return (
        <div className="relative">
            <hr className="border-t border-[#b4b0b0]" />
            <button
                onClick={localOnClick}
                type="button"
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d9d9d9] rounded-full p-1 hover:bg-gray-300 cursor-pointer"
            >
                <Plus className="w-5 h-5" />{}
            </button>
        </div>
    );
}

export function ContentBlockOption() {}