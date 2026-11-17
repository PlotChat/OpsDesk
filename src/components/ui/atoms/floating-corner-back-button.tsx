import { useNavigate, type To } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "./button";

interface FloatingCornerBackButtonProps {
	url?: To | number;
	label: string;
}

const FloatingCornerBackButton = ({ url = -1, label }: FloatingCornerBackButtonProps) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (typeof url === "number") {
			navigate(url);
		} else {
			navigate(url);
		}
	};

	return (
		<Button variant="outline" className="absolute top-8 left-8" onClick={handleClick}>
			<IoIosArrowBack /> {label}
		</Button>
	);
};

export default FloatingCornerBackButton;