import type { ReactNode } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainProps {
	children?: ReactNode;
}

const Main = ({ children }: MainProps) => {
	return (
        <>
            <Header></Header>
            <div className="flex relative overflow-hidden w-full max-h-screen">
                <Sidebar></Sidebar>
                <main className="grow px-30 py-12 overflow-scroll">
                    <Outlet></Outlet>
                    <Outlet></Outlet>
                    <Outlet></Outlet>
                    <Outlet></Outlet>
                    <Outlet></Outlet>
                    {children}
                </main>
            </div>
        </>
	);
};
export default Main;
