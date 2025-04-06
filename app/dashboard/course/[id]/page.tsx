"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Page() {
    return (
        <main className="flex flex-col gap-4">
            <Link href={"/dashboard"} className="flex flex-row gap-2 mb-4">
                <ArrowLeftIcon className="w-6"/>
            </Link>
            <h1 className="text-3xl font-bold mb-4">Courses</h1>
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Course Name</h2>
                <p className="text-gray-500">Description of the course goes here.</p>
            </div>
        </main>
    );
}