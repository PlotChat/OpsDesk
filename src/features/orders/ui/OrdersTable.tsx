import { useState } from "react";
import { useGetOrdersPage } from "../hooks/useOrders";
import FeatureTable, {
	type FeatureTableSortOption,
} from "@/components/ui/feature-tables/feature-table";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import {
	type Order,
	type OrderFilterType,
	type OrderSortType,
	type OrderStatus,
} from "../types/types";
import { Button } from "@/components/ui/atoms/button";
import ViewOrderDialog from "./ViewHandleOrderDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/atoms/badge";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import { BsAlphabetUppercase } from "react-icons/bs";
import type { FeatureTableSortType } from "@/components/ui/feature-tables/types";
import { formatCurrency } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
} from "@/components/ui/atoms/dropdown-menu";
import { useOrderStatuses } from "../hooks/useOrderStatuses";

const orderColumns = [
	{ key: "customer_name", label: "Customer Name", tooltip: (row) => `${row.customer_name}` },
	{
		key: "total_amount",
		label: "Total",
		renderElements: (row) => formatCurrency(row.total_amount),
	},
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
] as const satisfies DataTableColumn<Order>[];

const orderSortOptions = [
	{ value: "customer_name", label: "Alphabet", icon: BsAlphabetUppercase },
	{ value: "total_amount", label: "Total Amount", icon: IoPricetagsOutline },
	{ value: "created_at", label: "Date", icon: MdAccessTime },
] as const satisfies FeatureTableSortOption<Order>[];

const OrdersTable = () => {
	// Simple table states
	const [currOrderId, setCurrOrderId] = useState<Order["id"]>("");
	const [currPage, setCurrPage] = useState<number>(1);

	// Sort and filter states
	const [sortBy, setSortBy] = useState<FeatureTableSortType<Order>>({
		column: "created_at",
		isAscending: false,
	});

	const [filters, setFilters] = useState<OrderFilterType>({
		status: null,
	});

	// Search states and debouncer
	const [searchInput, setSearchInput] = useState("");
	const debouncedSearch = useDebounce({
		value: searchInput,
		delay: 300,
		onDebounce: () => setCurrPage(1),
	});

	// Handlers
	const handleSearchChange = (value: string) => {
		setSearchInput(value);
	};

	const handleSortBy = (sorts: OrderSortType) => {
		if (!sorts) return;

		setSortBy(sorts);
		setCurrPage(1);
	};

	const handleFilterBy = (newFilters: OrderFilterType) => {
		if (!filters) return;

		setFilters((prev) => ({ ...prev, ...newFilters }));
		setCurrPage(1);
	};

	// Queries
	const queryClient = useQueryClient();
	const { orders, totalPages, isPlaceholderData, isFetching, isPending, isError, error } =
		useGetOrdersPage({
			page: currPage,
			pageSize: 10,
			filterBy: { search: debouncedSearch, ...filters },
			sortBy,
		});
	const { orderStatuses } = useOrderStatuses();

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
							value={searchInput}
							onChange={handleSearchChange}
						/>

						<FeatureTable.Filter>
							{orderStatuses && orderStatuses.length > 0 && (
								<DropdownMenuGroup>
									<DropdownMenuLabel>Statuses</DropdownMenuLabel>
									<DropdownMenuItem
										onClick={() => {
											handleFilterBy({ status: null });
										}}
									>
										All
									</DropdownMenuItem>
									{orderStatuses?.map((o: OrderStatus) => {
										return (
											<DropdownMenuItem
												key={o.id}
												onClick={() => {
													handleFilterBy({ status: o.id });
												}}
											>
												{o.id}
											</DropdownMenuItem>
										);
									})}
								</DropdownMenuGroup>
							)}
						</FeatureTable.Filter>

						{/* Sort dropdown */}
						<FeatureTable.Sort
							value={sortBy}
							onChange={(sort) => handleSortBy(sort)}
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
					isLoading={isPending || isPlaceholderData}
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
