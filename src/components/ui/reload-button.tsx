import { TbReload } from "react-icons/tb";
import { Button } from "./button";
import type { ComponentPropsWithoutRef } from "react";

interface ReloadButtonProps extends ComponentPropsWithoutRef<"button">{
    isLoading: boolean,
}

const ReloadButton = ({isLoading, onClick, children}: ReloadButtonProps) => {
	return (
		<Button onClick={onClick}>
			<TbReload className={isLoading ? "animate-spin opacity-50" : ""}></TbReload>
            {children}
		</Button>
	);
};
export default ReloadButton;
