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
import { Button } from "@/components/ui/button";

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
 


export function AppSidebar() {
    
    const router = useRouter();
    const pathname = usePathname();
    const handleRouter = () => {
        router.back();
    }
    
    const id = pathname.split('/')[3]; // Assuming the ID is the 4th segment in the path

    const items = [
        {
            title: 'Editor',
            url: `/dashboard/course/${id}`,
            icon: Edit,
        },
        {
            title: 'Presentation',
            url: `/dashboard/course/${id}/presentation`,
            icon: PresentationIcon
        }
] 


    return (
        <Sidebar collapsible="icon">
        <SidebarHeader />
        <SidebarContent>
            <SidebarGroup />
                <SidebarGroupLabel> 
                <div className="flex flex-row items-center gap-4 mb-4">
                    <Button className="hover:cursor-pointer" onClick={handleRouter}>
                        <ArrowLeftIcon /> Back to Dashboard
                    </Button>
                    {/* <a href={"/dashboard"} className="flex flex-row gap-2 mb-4">
                        <ArrowLeftIcon className="w-4"/>
                    </a>
                    <h1 className=" font-bold mb-4">{'Back to dashboard'}</h1> */}
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
