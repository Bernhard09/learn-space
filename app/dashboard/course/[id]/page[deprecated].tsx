"use client"

import Link from "next/link";
import ToggleButton from "@/components/ui/dashboard/toggle-button";
import SectionComponent from "@/components/ui/course/section";
import AddSectionButton from "@/components/ui/course/section-button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { ArrowLeft, Share2, Plus, Image, Code, X } from "lucide-react"
import { Section } from "@/lib/definition";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import React from "react";


export default function Page(props: {}) {
    
    const [sections, setSections] = useState<Section[]>([
        { id: uuidv4(), type: "text", content: "this text" }, 
    ])

    const updateSection = (id: string, content: string) => {
        setSections((prev) => 
            prev.map((section) => (section.id === id ? {...section, content: content} : section))
        );
    }
    
    const insertSection = (position: number, id?: string ) => {
        const newSection: Section = {
            id: uuidv4(),
            type: "text",
            content: "",
        };
        if (!id) {
            const newSectionData = sections.slice(0, position).concat(newSection, sections.slice(position));
            // setSections((prev) => [...prev, newSection]);
            setSections(newSectionData);
            return;
        } else {
            const index = sections.findIndex((section) => section.id === id);
            const updatedContents = [...sections];
            updatedContents.splice(index + 1, 0, newSection);
            setSections(updatedContents);
        }
    }

    return (
        <main className="flex flex-col gap-4 p-4">
            <div className="flex flex-row items-center gap-4 mb-4">
                <Link href={"/dashboard"} className="flex flex-row gap-2 mb-4">
                    <ArrowLeftIcon className="w-6"/>
                </Link>
                <h1 className="text-3xl font-bold mb-4">Course Title</h1>
            </div>
            <AddSectionButton onClick={insertSection}/>
            {
                sections.map((section, index) => {
                    return ( 
                        <>
                            <React.Fragment key={section.id}>
                                <SectionComponent key={section.id} id={section.id} type={section.type} content={section.content} onUpdate={updateSection}/>
                                <AddSectionButton key={`add-btn-${index}`} position={index+1} onClick={insertSection}/>
                            </React.Fragment>
                        </>
                    )
                })
            }   
        </main>
    );
}

