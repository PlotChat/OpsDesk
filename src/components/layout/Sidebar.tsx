import { LuShoppingBag } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router";
import {
	Sidebar as ShadcnSidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { cn } from "cn";
import logo from "@/assets/logo.svg";
import { Separator } from "../ui/separator";

const navItems = [
	{
		title: "Products",
		url: "./products",
		icon: LuShoppingBag,
	},
	{
		title: "Orders",
		url: "./orders",
		icon: IoReceiptOutline,
	},
];

const Sidebar = () => {
	const location = useLocation();
	const { setOpen, openMobile, isMobile } = useSidebar();

	const handleMouseEnter = () => {
		if (!isMobile) {
			setOpen(true);
		}
	};

	const handleMouseLeave = () => {
		if (!isMobile) {
			setOpen(false);
		}
	};

	return (
		<>
			{!openMobile && (
				<SidebarTrigger
					render={<Button variant="outline" className={"bg-background"}></Button>}
					className={cn("absolute top-2 left-2 md:hidden p-4 z-1000")}
				></SidebarTrigger>
			)}
			<ShadcnSidebar
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				collapsible="icon"
				className="sticky m-0 border-r border-border"
			>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							{isMobile && (
								<>
									<SidebarHeader className="p-3">
										<h1 className="flex items-center">
											Powered by{" "}
											<span className="ms-2 me-0.5">
												<img className="size-4" src={logo}></img>
											</span>{" "}
											OpsDesk
										</h1>
									</SidebarHeader>
									<Separator></Separator>
								</>
							)}
							<SidebarMenu className="mt-2">
								{navItems.map((item) => {
									const isActive = location.pathname.includes(item.url.replace("./", ""));

									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton isActive={isActive} tooltip={item.title}>
												<Link to={item.url} className="flex items-center gap-2">
													<item.icon className="size-5 shrink-0" />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</ShadcnSidebar>
		</>
	);
};

export default Sidebar;
