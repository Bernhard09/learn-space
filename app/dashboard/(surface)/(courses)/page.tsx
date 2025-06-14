import { Button } from "@/components/ui/button";
import CardWrapper from "@/components/ui/dashboard/card";
import SearchBar from "@/components/ui/dashboard/search-bar";
import { PlusIcon } from "lucide-react";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


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
                {/* <Button 
                    // onClick={handleAddCourse}
                    className="hover:cursor-pointer"
                >
                    Add Course <PlusIcon />
                </Button> */}
                
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                        <Button variant="outline"> Add Course <PlusIcon /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Course</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                                <div className="grid w-full max-w-sm items-center gap-3">
                                    <Label htmlFor="picture">Picture</Label>
                                    <Input id="picture" type="file" />
                                </div>
                            <div className="grid gap-3">
                                <Label htmlFor="title-1">Title</Label>
                                <Input id="title-1" name="title" placeholder="Course Name" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="description-1">Description</Label>
                                <Textarea id="description-1" name="description" placeholder="What the course is about..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Add</Button>
                        </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
            <CardWrapper />
        </main>
    );
}