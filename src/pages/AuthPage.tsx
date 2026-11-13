import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Outlet, useNavigate } from "react-router";

const AuthPage = () => {
  const navigate = useNavigate();

	return (
		<div className="flex justify-center items-center h-screen w-full relative">
      <Button variant="outline" className="absolute top-8 left-8" onClick={() => navigate("/home")}><IoIosArrowBack /> Home</Button>
			<Outlet></Outlet>
		</div>
	);
};
export default AuthPage;
