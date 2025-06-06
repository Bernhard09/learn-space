import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar() {
    return (
        <div className="flex justify-end items-center max-w-xs md:max-w-4xl border border-gray-300 px-4 rounded-lg">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 mr-2" />
            
            <input
                type="text"
                placeholder="Search..."
                className="w-full max-w-md px-4 py-2  focus:outline-none "
            />
        </div>
    );
}