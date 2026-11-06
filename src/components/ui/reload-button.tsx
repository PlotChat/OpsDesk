import { TbReload } from "react-icons/tb";
import { Button } from "./button";
import type { ComponentProps } from "react";

interface ReloadButtonProps extends ComponentProps<typeof Button> {
    isLoading: boolean;
}

const ReloadButton = ({isLoading, onClick, children, ...props}: ReloadButtonProps) => {
	return (
		<Button {...props} onClick={onClick}>
			<TbReload className={isLoading ? "animate-spin opacity-50" : ""}></TbReload>
            {children}
		</Button>
	);
};
export default ReloadButton;
