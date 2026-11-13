import { cn } from "cn";
import { Outlet } from "react-router";

const DashboardPage = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				className,
				"[ min-w-75 w-[95%] max-w-300 ] [ px-2 py-8 md:px-10 md:py-11 mx-auto ]",
			)}
		>
			<Outlet></Outlet>
		</div>
	);
};
export default DashboardPage;
