import { CopyButton } from "@/components/ui/atoms/copy-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/atoms/dialog";
import type { Order, OrderStatus } from "../types/types";
import { useGetOrder } from "../hooks/useOrders";
import { Button } from "@/components/ui/atoms/button";
import { cn } from "cn";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/atoms/select";

import { useState } from "react";
import { useOrderStatuses, useUpdateOrderStatus } from "../hooks/useOrderStatuses";
import { FaSave } from "react-icons/fa";
import { Separator } from "@/components/ui/atoms/separator";
import { OrderItemsTable } from "./OrderItemsTable";

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

							{order && <ViewHandleOrderStatusSelect order={order} />}
						</div>

						<div className={cn(labelStyles, "overflow-scroll")}>
							<div className="flex justify-between">
								<label>Ordered Products</label>
							</div>
							<Separator className={"my-3"}></Separator>

							<div className="flex flex-col justify-between gap-2">
								{!isPending && order && (
									<OrderItemsTable
										orderId={order.id}
										containerClassName={"overflow-scroll h-59 rounded-2xl mb-2"}
										includeTotalPrice={true}
										loadingRowCount={5}
									></OrderItemsTable>
								)}
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<Button onClick={() => onOpenChange(false)} variant={"secondary"}>
								Close
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};
export default ViewHandleOrderDialog;

const ViewHandleOrderStatusSelect = ({ order }: { order: Order }) => {
	const {
		orderStatuses,
		isError: isOrderStatusError,
		isPending: isOrderStatusPending,
	} = useOrderStatuses();

	const [chosenStatus, setChosenStatus] = useState<OrderStatus["id"] | null>(order.status || null);
	const {
		mutate,
		isPending: isStatusUpdatePending,
		isError: isStatusUpdateError,
	} = useUpdateOrderStatus();

	const statusSelectItems: { label: string; value: OrderStatus["id"] }[] = (
		orderStatuses || []
	).map((s: OrderStatus) => ({
		label: s.id,
		value: s.id,
	}));

	return (
		<div className="flex gap-1">
			<Select
				disabled={isOrderStatusPending || isStatusUpdatePending}
				value={chosenStatus}
				onValueChange={(value: OrderStatus["id"] | null) => {
					setChosenStatus(value || null);
				}}
			>
				<SelectTrigger className="w-full max-w-48">
					<SelectValue placeholder="None">
						{isOrderStatusPending || isStatusUpdatePending ? "Loading..." : chosenStatus}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Order Status</SelectLabel>
						{statusSelectItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>

			{!isStatusUpdatePending && chosenStatus && chosenStatus !== order.status && (
				<Button
					variant="success"
					onClick={() => {
						if (chosenStatus) mutate({ orderId: order.id, newStatus: chosenStatus });
						else return;
					}}
					className="ms-1"
				>
					<FaSave /> Save
				</Button>
			)}

			{isOrderStatusError && !isOrderStatusPending && (
				<span className="text-red-500">Error loading order statuses</span>
			)}

			{isStatusUpdateError && <span className="text-red-500">Error updating order status</span>}
		</div>
	);
};

const ViewHandleOrderDialogSkeleton = () => {
	return (
		<>
			<div className={cn(labelStyles, "h-17 animate-pulse")}>
				<div className="flex justify-between"></div>
			</div>

			<div className={cn(labelStyles, "h-21 animate-pulse")}>
				<div className="flex justify-between"></div>
			</div>

			<div className={cn(labelStyles, "h-89 animate-pulse")}>
				<div className="flex justify-between"></div>
			</div>

			<div className="flex justify-end gap-2">
				<Button disabled variant={"secondary"} className={"animate-pulse w-15"}></Button>
			</div>
		</>
	);
};
