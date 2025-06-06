"use client"

// import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { Edit, PresentationIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type sideBarItem = {
    title: string;
    url: string;
}

// type presentationSideBar = {
//     title: string;
//     desc: string | null;
//     url: string;
// }

// function isPresentationSideBar(data: unknown): data is presentationSideBar {
//     if (typeof data !== 'object' || data === null) return false;

//     const item = data as Record<>
// }

const items = [
        {
            title: 'Editor',
            url: '/dashboard/course/1',
            icon: Edit,
        },
        {
            title: 'Presentation',
            url: '/dashboard/course/1/presentation',
            icon: PresentationIcon
        }
    ] 


export function AppSidebar() {
    
    const router = useRouter();
    const pathname = usePathname();
    const handleRouter = () => {
        router.back();
    }
    

    console.log(`pathname: ${pathname}`);

    return (
        <Sidebar collapsible="icon">
        <SidebarHeader />
        <SidebarContent>
            <SidebarGroup />
                <SidebarGroupLabel> 
                <div className="flex flex-row items-center gap-4 mb-4">
                    <a href={"/dashboard"} className="flex flex-row gap-2 mb-4">
                        <ArrowLeftIcon className="w-6"/>
                    </a>
                    <h1 className="text-3xl font-bold mb-4">{'Course Title'}</h1>
                </div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {/* {addPresentation != null ? <button>add presentation</button> : ''}  */}
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url} >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
        </Sidebar>
    )
}
