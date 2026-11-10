import type { ReactNode } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider } from "../ui/sidebar";

interface MainProps {
	children?: ReactNode;
}

const Main = ({ children }: MainProps) => {
	return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex flex-col h-screen w-full">
                <Header></Header>
                <div className="flex grow relative overflow-hidden">
                    <Sidebar></Sidebar>
                    <main className="grow overflow-y-auto">
                        <Outlet></Outlet>
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
	);
};
export default Main;
