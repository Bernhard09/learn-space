import { Button } from "@/components/ui/button";
import CardWrapper from "@/components/ui/dashboard/card";
import SearchBar from "@/components/ui/dashboard/search-bar";
import { PlusIcon } from "lucide-react";


const handleAddCourse = () => {

}

export default function Page() {
    return (
        <main className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-4xl font-bold mb-4">Courses</h1>
                <SearchBar />
            </div>
            <div className="flex flex-row-reverse mt-4">
                <Button 
                    // onClick={handleAddCourse}
                    className="hover:cursor-pointer"
                >
                    Add Course <PlusIcon />
                </Button>
            </div>
            <CardWrapper />
        </main>
    );
}