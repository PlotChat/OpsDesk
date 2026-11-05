import { useState } from "react";
import { useGetOrdersPage } from "../hooks/useOrders";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import type { Order } from "../types/types";
import { Button } from "@/components/ui/button";
import { FeatureTablePagination } from "@/components/ui/feature-tables/feature-table-pagination";
import ViewOrderDialog from "./ViewHandleOrderDialog";
import { TbReload } from "react-icons/tb";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const OrderTableActions = ({ onView }: { orderId: Order["id"]; onView: () => void }) => {
	return (
		<div className="flex gap-1 justify-center">
			<Button variant="default" onClick={onView}>
				View / Handle
			</Button>
		</div>
	);
};

const OrdersHeaderActions = () => {
	const queryClient = useQueryClient();
	return (
		<div className="flex gap-2">
			<Button onClick={() => queryClient.invalidateQueries({ queryKey: ["ordersPage"] })}>
				<TbReload></TbReload>
			</Button>
		</div>
	);
};

const orderColumns = [
	{ key: "customer_name", label: "Customer Name" },
	{ key: "total_amount", label: "Total" },
	{ key: "created_at", label: "Created at" },
	{
		key: "status",
		label: "Status",
		renderElements: (row) => {
			const variantMap: Record<
				string,
				"pending" | "shipped" | "delivered" | "cancelled" | "default" | "processing"
			> = {
				Pending: "pending",
				Processing: "processing",
				Shipped: "shipped",
				Delivered: "delivered",
				Cancelled: "cancelled",
			};

			const variant = variantMap[row.status] || "default";

			return <Badge variant={variant}>{row.status}</Badge>;
		},
	},
] satisfies DataTableColumn<Order>[];

const OrdersTable = () => {
	const [currOrderId, setCurrOrderId] = useState<Order["id"]>("");
	const [currPage, setCurrPage] = useState<number>(1);
	const { orders, totalPages, isPlaceholderData, isPending, isError, error } = useGetOrdersPage({
		page: currPage,
		pageSize: 10,
	});

	if (isPending) {
		return <div>Loading</div>;
	}
	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<>
			<FeatureTable
				title="Orders"
				rowKey={"id"}
				isTableFixed={true}
				isLoading={isPlaceholderData}
				defaultTotalRows={10}
				data={orders}
				columns={orderColumns}
				renderFeatureActions={(row: Order) => (
					<OrderTableActions
						orderId={row.id}
						onView={() => setCurrOrderId(row.id)}
					></OrderTableActions>
				)}
				renderHeaderActions={OrdersHeaderActions}
			></FeatureTable>

			<FeatureTablePagination
				className="mt-7"
				currentPage={currPage}
				totalPages={totalPages}
				onPageChange={setCurrPage}
			></FeatureTablePagination>

			{currOrderId && (
				<ViewOrderDialog
					open={currOrderId ? true : false}
					onOpenChange={(isOpen) => {
						if (!isOpen) setCurrOrderId("");
					}}
					orderId={currOrderId}
				></ViewOrderDialog>
			)}
		</>
	);
};

export default OrdersTable;
