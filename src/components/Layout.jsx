import {
    SidebarProvider,
    SidebarTrigger
} from "./ui/sidebar";

import { AppSidebar } from "./ui/sidebar";

export default function Layout({ children, setActive }) {
    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen">

                <AppSidebar setActive={setActive} />

                <main className="flex-1 w-full p-4">
                    <SidebarTrigger />
                    {children}
                </main>

            </div>
        </SidebarProvider>
    );
}