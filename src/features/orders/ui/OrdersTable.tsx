import { useState } from "react";
import { useGetOrdersPage } from "../hooks/useOrders";
import FeatureTable, {
	type FeatureTableSortOption,
} from "@/components/ui/feature-tables/feature-table";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import { type Order, type OrderFilterType, type OrderSortType } from "../types/types";
import { Button } from "@/components/ui/button";
import ViewOrderDialog from "./ViewHandleOrderDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import { BsAlphabetUppercase } from "react-icons/bs";
import type { FeatureTableSortType } from "@/components/ui/feature-tables/types";

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
				"pending" | "shipped" | "delivered" | "cancelled" | "processing" | "default"
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

const orderSortOptions = [
	{ value: "customer_name", label: "Alphabet", icon: BsAlphabetUppercase },
	{ value: "total_amount", label: "Total Amount", icon: IoPricetagsOutline },
	{ value: "created_at", label: "Date", icon: MdAccessTime },
] satisfies FeatureTableSortOption<Order>[];

const OrdersTable = () => {
	const [currOrderId, setCurrOrderId] = useState<Order["id"]>("");
	const [currPage, setCurrPage] = useState<number>(1);
	const [sortBy, setSortBy] = useState<FeatureTableSortType<Order>>({
		column: "created_at",
		isAscending: false,
	});
	const [filterBy, setFilterBy] = useState<OrderFilterType>({ customer_name: "" });

	const queryClient = useQueryClient();
	const { orders, totalPages, isPlaceholderData, isFetching, isPending, isError, error } =
		useGetOrdersPage({
			page: currPage,
			pageSize: 10,
			filterBy,
			sortBy,
		});

	const handleFilterBy = (filters: OrderFilterType) => {
		if (!filters) return;

		setFilterBy(filters);
		setCurrPage(1);
	};

	const handleSortBy = (sorts: OrderSortType) => {
		if (!sorts) return;

		setSortBy(sorts);
		setCurrPage(1);
	};

	if (isPending) {
		return <div>Loading</div>;
	}
	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<div className="mx-auto flex flex-col justify-between">
			<FeatureTable className="h-170">
				<FeatureTable.Header>
					<FeatureTable.Title className="px-2">Orders</FeatureTable.Title>

					<FeatureTable.Actions>
						{/* Search input */}
						<FeatureTable.Search
							placeholder="Customer name..."
							onChange={(value) =>
								handleFilterBy({
									...filterBy,
									customer_name: value,
								})
							}
						/>

						{/* Sort dropdown */}
						<FeatureTable.Sort
							value={sortBy}
							onChange={(sort) =>
								handleSortBy(sort)
							}
							options={orderSortOptions}
						/>

						{/* Reload button */}
						<FeatureTable.ReloadButton
							isLoading={isFetching}
							onClick={() => queryClient.invalidateQueries({ queryKey: ["ordersPage"] })}
						/>
					</FeatureTable.Actions>
				</FeatureTable.Header>

				<FeatureTable.Content
					data={orders}
					columns={orderColumns}
					isLoading={isPlaceholderData}
					isTableFixed={true}
					rowKey={"id"}
					className="h-full"
					renderFeatureActions={(row: Order) => (
						<OrderTableActions orderId={row.id} onView={() => setCurrOrderId(row.id)} />
					)}
				/>

				<FeatureTable.Pagination
					currentPage={currPage}
					totalPages={totalPages}
					onPageChange={setCurrPage}
				/>
			</FeatureTable>

			{currOrderId && (
				<ViewOrderDialog
					open={Boolean(currOrderId)}
					onOpenChange={(isOpen) => {
						if (!isOpen) setCurrOrderId("");
					}}
					orderId={currOrderId}
				/>
			)}
		</div>
	);
};

export default OrdersTable;

const OrderTableActions = ({ onView }: { orderId: Order["id"]; onView: () => void }) => {
	return (
		<div className="flex gap-1 justify-center">
			<Button variant="default" onClick={onView}>
				View / Handle
			</Button>
		</div>
	);
};
