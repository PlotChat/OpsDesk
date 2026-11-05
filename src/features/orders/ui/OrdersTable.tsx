import { useState } from "react";
import { useDeleteOrder, useGetOrdersPage } from "../hooks/useOrders";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import type { Order } from "../types/types";
import { Button } from "@/components/ui/button";
import { FeatureTablePagination } from "@/components/ui/feature-tables/feature-table-pagination";
import ViewOrderDialog from "./ViewOrderDialog";
import { toast } from "@/components/ui/toast";
import { TbReload } from "react-icons/tb";
import { useQueryClient } from "@tanstack/react-query";

const OrderTableActions = ({ orderId, onView }: { orderId: Order["id"]; onView: () => void }) => {
	const { deleteOrder, isDeleting } = useDeleteOrder();

	return (
		<div className="flex gap-1 justify-center">
			<Button onClick={onView} disabled={isDeleting}>
				View / Edit
			</Button>
			<Button
				variant="destructive"
				onClick={() => {
					deleteOrder({ id: orderId });
					toast.add({
						title: "Product deleted!",
						description: new Intl.DateTimeFormat().format(),
					});
				}}
				disabled={isDeleting}
			>
				{isDeleting ? "..." : "Delete"}
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
	{ key: "status", label: "Status" },
	{ key: "total_amount", label: "Total" },
	{ key: "created_at", label: "Created at" },
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
