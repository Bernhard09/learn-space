"use client";


import Image from "next/image";
import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";


const cardsInfo = [
    {   
        id: 1,
        title: "Course 1",
        description: "This is the description for card 1",
        img: "/web-dev-dummy-img.jpg"
    },
    {
        id: 2,
        title: "Course 2",
        description: "This is the description for card 2",
        img: "/web-dev-dummy-img.jpg"
    },
    {
        id: 3,
        title: "Course 3",
        description: "This is the description for card 3",
        img: "/web-dev-dummy-img.jpg"
    },
    {   
        id: 4,
        title: "Course 4",
        description: "This is the description for card 4",
        img: "/web-dev-dummy-img.jpg"
    }
];


export function Card({
    id,
    title="Title", 
    description="This is the description", 
    img
}:{
    id: number,
    title: string,
    description: string
    img?: string
}) {
    const pathname = usePathname();
    const detailPath = pathname + "/course/" + id.toString();

    if (description.length > 50) {
        description = description.slice(0, 50) + "..."
    } 
    
    return (
        <div className={`flex flex-col border shadow-lg rounded-xl p-4`}>
            <Image
                className="rounded-xl mb-4 self-center" 
                src={
                    img ? img : "/web-dev-dummy-img.jpg"
                } 
                alt=""
                width={400}
                height={200}
            />
    
            <div className="flex flex-row justify-between">
                <div className="flex flex-col mb-4 overflow-hidden">
                    <h2 className="text-xl font-bold ">{title}</h2>
                    <p className="text-gray-700 text-sm">{description}</p>
                </div>
                <EllipsisVerticalIcon className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />

            </div>
            <Link href={detailPath} className="flex justify-center border text-black py-2 px-4 rounded-2xl hover:bg-sky-100 hover:text-blue-600 hover:border-blue-600 transition duration-300 cursor-pointer">
                Jump In
            </Link>
        </div>
            
        
    );
}

export default function CardWrapper() {
    return (
        <div className={` grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4`}>
            {cardsInfo.map((cards) => (
                <Card
                    key={cards.id+cards.title}
                    id={cards.id} 
                    title={cards.title}
                    description={cards.description}
                    img={cards.img}
                />
            ))}
        </div>
    );
}