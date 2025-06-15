import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { title } from "process";
import { Book, icons } from "lucide-react";


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar  />
            <main className="flex flex-col gap-4 p-4 w-screen">
                <SidebarTrigger />
                {/* menu-bar */}
                {/* <div className="flex flex-row items-center gap-4 mb-4">
                    <Link href={"/dashboard"} className="flex flex-row gap-2 mb-4">
                        <ArrowLeftIcon className="w-6"/>
                    </Link>
                    <h1 className="text-3xl font-bold mb-4">Course Title</h1>
                </div> */}
                {children}
            </main>
        </SidebarProvider>
    );
}