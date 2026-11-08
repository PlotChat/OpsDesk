import { useState } from "react";
import { useGetOrdersPage } from "../hooks/useOrders";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import { type Order, type OrderFilterType, type OrderSortType } from "../types/types";
import { Button } from "@/components/ui/button";
import { FeatureTablePagination } from "@/components/ui/feature-tables/feature-table-pagination";
import ViewOrderDialog from "./ViewHandleOrderDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import ReloadButton from "@/components/ui/reload-button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { IoPricetagsOutline, IoSearch } from "react-icons/io5";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdAccessTime } from "react-icons/md";
import { BsAlphabetUppercase } from "react-icons/bs";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";

const OrdersTable = () => {
	const [currOrderId, setCurrOrderId] = useState<Order["id"]>("");
	const [currPage, setCurrPage] = useState<number>(1);
	const [sortBy, setSortBy] = useState<OrderSortType>({ column: "created_at", isAscending: false });
	const [filterBy, setFilterBy] = useState<OrderFilterType>({ customer_name: "" });

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
					<OrdersHeaderActions
						handleSortBy={handleSortBy}
						handleFilterBy={handleFilterBy}
						filterBy={filterBy}
						sortBy={sortBy}
						isLoading={isFetching}
					/>
				</FeatureTable.Header>

				<FeatureTable.Content
					data={orders || []}
					columns={orderColumns}
					isLoading={isPlaceholderData}
					isTableFixed={true}
					rowKey={"id"}
					className="h-full"
					renderFeatureActions={(row: Order) => (
						<OrderTableActions
							orderId={row.id}
							onView={() => setCurrOrderId(row.id)}
						></OrderTableActions>
					)}
				/>

				<FeatureTablePagination
					className="mt-3"
					currentPage={currPage}
					totalPages={totalPages}
					onPageChange={setCurrPage}
				></FeatureTablePagination>
			</FeatureTable>

			{currOrderId && (
				<ViewOrderDialog
					open={currOrderId ? true : false}
					onOpenChange={(isOpen) => {
						if (!isOpen) setCurrOrderId("");
					}}
					orderId={currOrderId}
				></ViewOrderDialog>
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

interface OrdersHeaderActionsProps {
	isLoading: boolean;
	filterBy: OrderFilterType;
	sortBy: OrderSortType;
	handleSortBy: (sortBy: OrderSortType) => void;
	handleFilterBy: (filterBy: OrderFilterType) => void;
}

const OrdersHeaderActions = ({
	isLoading,
	filterBy,
	sortBy,
	handleSortBy,
	handleFilterBy,
}: OrdersHeaderActionsProps) => {
	const queryClient = useQueryClient();

	return (
		<>
			<div className="flex items-center px-2">
				<h1 className="text-2xl">Orders</h1>
			</div>

			<div className="flex items-center gap-2 *:h-9.5">
				<InputGroup>
					<InputGroupAddon>
						<IoSearch className="text-secondary-foreground"></IoSearch>
					</InputGroupAddon>
					<InputGroupInput
						onChange={(e) =>
							handleFilterBy({
								...filterBy,
								customer_name: e.currentTarget.value,
							})
						}
						className="w-full h-full"
						placeholder="Customer name..."
					></InputGroupInput>
				</InputGroup>

				{/* Dropdown Sort Button */}
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button className="flex gap-0.5" variant="outline">
								<BiSortAlt2 />
								<span>Sort</span>
							</Button>
						}
					></DropdownMenuTrigger>
					<DropdownMenuContent className={"w-max"} side="bottom" align="end">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Directions</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={sortBy.isAscending}
								onValueChange={(value) => handleSortBy({ ...sortBy, isAscending: value })}
							>
								<DropdownMenuRadioItem value={true} onSelect={(e) => e.preventDefault()}>
									<FaSortAmountUp />
									Ascending
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value={false} onSelect={(e) => e.preventDefault()}>
									<FaSortAmountDownAlt />
									Descending
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuGroup>
						<DropdownMenuSeparator></DropdownMenuSeparator>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Sort By</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={sortBy.column}
								onValueChange={(value) => {
									handleSortBy({ column: value, isAscending: sortBy.isAscending })
									}}
							>
								<DropdownMenuRadioItem value="customer_name" onSelect={(e) => e.preventDefault()}>
									<BsAlphabetUppercase />
									Alphabet
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="total_amount" onSelect={(e) => e.preventDefault()}>
									<IoPricetagsOutline />
									Total Amount
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="created_at" onSelect={(e) => e.preventDefault()}>
									<MdAccessTime />
									Date
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<ReloadButton
					variant="outline"
					isLoading={isLoading}
					onClick={() => queryClient.invalidateQueries({ queryKey: ["ordersPage"] })}
				></ReloadButton>
			</div>
		</>
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
