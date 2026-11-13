import { useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import { VscError } from "react-icons/vsc";
import { Button } from "./button";
import { cn } from "cn";

export function CopyButton({ value, onCopy }: { value: string; onCopy?: () => void }) {
	const [isCopied, setIsCopied] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const handleCopy = async () => {
		if (isPending || isCopied || isError) return;

		try {
			setIsPending(true);

			await navigator.clipboard.writeText(value);
			setIsPending(false);
			setIsCopied(true);

			setTimeout(() => {
				setIsCopied(false);
			}, 2000);

			onCopy?.();
		} catch {
			setIsError(true);
			setTimeout(() => {
				setIsError(false);
			}, 2000);
		} finally {
			setIsPending(false);
		}
	};

	const getCopyButtonIcon = () => {
		if(isPending){
			return <CgSpinnerAlt className="animate-spin"></CgSpinnerAlt>;
		} else if(isError){
			return <VscError></VscError>
		} else if(isCopied){
			return <FaCheck></FaCheck>
		} else {
			return <FaRegCopy></FaRegCopy>
		}
	}

	return (
		<Button
			type="button"
			onClick={handleCopy}
			size={"sm"}
			variant="secondary"
			disabled={isPending || isCopied || isError}
			className={
				cn(
					"bg-transparent hover:bg-secondary/90 text-secondary-foreground/70 cursor-default aspect-square",
					{"hover:bg-transparent active:transform-none disabled:opacity-100": isPending || isCopied || isError}

				)
			}
		>
			<div className="sr-only">copy</div>
			{getCopyButtonIcon()}
		</Button>
	);
}
