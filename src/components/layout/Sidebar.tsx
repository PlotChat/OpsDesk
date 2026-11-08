import { LuShoppingBag } from "react-icons/lu";
import { Button } from "../ui/button";
import { IoReceiptOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import type { IconType } from "react-icons/lib";

const Sidebar = () => {
	return (
		<>
			{/* The sidebar's real space (acts like a wrapper too) */}
			<div
				className="
          [ relative peer/sidebar ]
          [ w-15 min-w-15 h-full min-h-screen ]
          [ z-999 ]
        "
			>
        {/* The sidebar */}
				<aside
					className="
            [ absolute flex flex-col justify-between ] 
            [ w-12 h-full py-2 px-2 gap-2 ] 
            [ hover:w-50 transition-[width] duration-100 delay-200 ease-in-out ]
            [ bg-popover text-popover-foreground border-r-border border-r ]
          "
				>
          <nav className="overflow-hidden">
            {/* Top section */}
            <section className="flex flex-col gap-2 overflow-hidden ps-1">
              <SidebarButton IconComponent={LuShoppingBag} label="Products" navigateTo="./products"/>
              <SidebarButton IconComponent={IoReceiptOutline} label="Orders" navigateTo="./orders"/>
            </section>
          </nav>
				</aside>
			</div>

			{/* Sidebar background filer when sidebar is hovered */}

			<div
				className="
          [ peer/sidebarBg absolute ]
          [ inset-0 ]
          [ peer-hover/sidebar:opacity-100 delay-200 transition-all duration-200]
          [ bg-black/35 z-998 pointer-events-none opacity-0 ]
        "
			></div>
		</>
	);
};

export default Sidebar;

const SidebarButton = ({IconComponent, label, navigateTo}: {IconComponent: IconType, label: string, navigateTo: string}) => {
  const navigate = useNavigate();

	return (
		<Button
			variant="ghost"
			className="flex gap-2 h-10 justify-start items-center px-0"
			onClick={() => navigate(`${navigateTo}`)}
		>
			{IconComponent && <IconComponent className={"size-5 me-2"}></IconComponent>}
      <span>{label}</span>
		</Button>
	);
};
