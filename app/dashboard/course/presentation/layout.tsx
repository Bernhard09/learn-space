import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


const items = [
    {
        title: 'Meet 1',
        desc: 'chapter 1 - 3',
        url: '1',

    }
];


const handleAddPresentation = () => {

}

export default function Layout({ 
    children 
} : { 
    children: React.ReactNode; 
}) {
    return (
        <SidebarProvider>
            <AppSidebar items={items} withRouter />
            <main className="flex flex-col gap-4 p-4 w-full">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
        
    );
}