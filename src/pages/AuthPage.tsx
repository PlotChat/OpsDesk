import FloatingCornerBackButton from "@/components/ui/floating-corner-back-button";
import { Outlet } from "react-router";

const AuthPage = () => {
	return (
		<div className="flex justify-center items-center h-screen w-full relative">
			<FloatingCornerBackButton url={"/home"} label="Back to Homepage" />
			<Outlet></Outlet>
		</div>
	);
};
export default AuthPage;
