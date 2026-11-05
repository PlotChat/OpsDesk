import { CopyButton } from "@/components/ui/copy-button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Order } from "../types/types";
import { useGetOrder } from "../hooks/useOrders";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

const labelStyles = "p-3 bg-muted/70 rounded-lg";

const ViewHandleOrderDialog = ({
	open,
	onOpenChange,
	orderId,
}: {
	open: boolean;
	orderId: Order["id"];
	onOpenChange: (isOpen: boolean) => void;
}) => {
	const { order, isPending } = useGetOrder({ id: orderId });

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Order Details</DialogTitle>
				</DialogHeader>

				{isPending ? (
					<ViewHandleOrderDialogSkeleton></ViewHandleOrderDialogSkeleton>
				) : (
					<>
						<div className={labelStyles}>
							<div className="flex justify-between">
								<label>Customer Name</label>
								<CopyButton value={order?.customer_name || ""}></CopyButton>
							</div>
							<span>{order?.customer_name}</span>
						</div>

						<div className={labelStyles}>
							<div className="flex justify-between">
								<label>Status</label>
								<CopyButton value={order?.status || ""}></CopyButton>
							</div>
							<span>{order?.status}</span>
						</div>

						<div className={labelStyles}>
							<div className="flex justify-between">
								<label>Total Amount</label>
								<CopyButton value={String(order?.total_amount) || ""}></CopyButton>
							</div>
							<span>{order?.total_amount}</span>
						</div>

						<div className="flex justify-end gap-2">
							<Button onClick={() => onOpenChange(false)} variant={"secondary"}>Close</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};
export default ViewHandleOrderDialog;

const ViewHandleOrderDialogSkeleton = () => {
	return (
		<>
			<div className={cn(labelStyles, "h-18 animate-pulse")}>
				<div className="flex justify-between"></div>
			</div>

			<div className={cn(labelStyles, "h-18 animate-pulse")}>
				<div className="flex justify-between"></div>
			</div>

			<div className={cn(labelStyles, "h-18 animate-pulse")}>
				<div className="flex justify-between"></div>
			</div>

			<div className="flex justify-end gap-2">
				<Button disabled variant={"secondary"} className={"animate-pulse w-15"}></Button>
			</div>
		</>
	);
};
