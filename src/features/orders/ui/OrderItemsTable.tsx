import FeatureTable from "@/components/ui/feature-tables/feature-table";
import type { CreateOrderItemType, Order, OrderItem } from "../types/types";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import { cn } from "cn";
import { useGetOrderItemsByOrderId } from "../hooks/useOrderItems";
import { Badge } from "@/components/ui/atoms/badge";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";

const orderItemColumns = [
	{ key: "name", label: "Name", tooltip: (row) => `${row.name}` },
	{ key: "quantity", label: "Qty" },
	{
		key: "unit_price",
		label: "Unit Price",
		renderElements(row) {
			return `$` + `${row.unit_price}`;
		},
	},
] as const satisfies DataTableColumn<OrderItem>[];

export const OrderItemsTable = ({
	orderId,
	containerClassName,
	loadingRowCount,
	includeTotalPrice = false,
}: {
	orderId: Order["id"];
	containerClassName?: string;
	loadingRowCount?: number;
	includeTotalPrice: boolean;
}) => {
	const { orderItems, isPlaceholderData, isPending, totalPrice } = useGetOrderItemsByOrderId({
		orderId,
	});

	return (
		<div>
			<>
				<div className={cn(containerClassName)}>
					<FeatureTable>
						<FeatureTable.Content
							className="my-1"
							data={orderItems}
							rowKey={"product_id"}
							columns={orderItemColumns}
							isLoading={isPlaceholderData || isPending}
							loadingRowCount={loadingRowCount}
						></FeatureTable.Content>
					</FeatureTable>
				</div>

				{includeTotalPrice && (
					<div className="mx-1 flex justify-between border border-border px-3 py-2.5 rounded-2xl">
						<h3>Total Price:</h3>
						<Badge variant={"success"}>{!isPending ? `$${totalPrice}` : "Loading..."}</Badge>
					</div>
				)}
			</>
		</div>
	);
};

const CreateOrderItemsActions = ({
	row,
	onRemoveItem,
}: {
	row: CreateOrderItemType;
	onRemoveItem: (row: CreateOrderItemType) => void;
}) => {
	return (
		<Button
			variant={"destructive"}
			onClick={() => {
				onRemoveItem(row);
			}}
		>
			<FaRegTrashAlt />
		</Button>
	);
};

export const CreateOrderItemsTable = ({
	data = [],
	totalPrice,
	containerClassName,
	onRemoveItem,
	onChangeItemQty,
}: {
	data: CreateOrderItemType[];
	totalPrice?: number;
	containerClassName?: string;
	onRemoveItem: (row: CreateOrderItemType) => void;
	onChangeItemQty: (row: CreateOrderItemType, value: number) => void;
}) => {
	const createOrderItemColumns = [
		{ key: "name", label: "Name", width: "lg", truncate: true, tooltip: (row) => `${row.name}`},
		{
			key: "quantity",
			label: "Qty",
			renderElements(row: CreateOrderItemType) {
				return (
					<Input
						type="number"
						value={row.quantity}
						onChange={(e) => onChangeItemQty(row, Number(e.currentTarget.value))}
						min={1}
						max={999}
					></Input>
				);
			},
		},
		{
			key: "unit_price",
			label: "Unit Price",
			renderElements(row) {
				return `$` + `${row.unit_price}`;
			},
			width: "xs",
		},
	] as const satisfies DataTableColumn<CreateOrderItemType>[];

	return (
		<div>
			<>
				<div className={cn(containerClassName)}>
					<FeatureTable>
						<FeatureTable.Content
							className="my-1"
							data={data}
							rowKey={"product_id"}
							columns={createOrderItemColumns}
							renderFeatureActions={(row) => (
								<CreateOrderItemsActions row={row} onRemoveItem={onRemoveItem} />
							)}
						></FeatureTable.Content>
					</FeatureTable>
				</div>

				{totalPrice && (
					<div className="mx-1 flex justify-between border border-border px-3 py-2.5 rounded-2xl">
						<h3>Total Price:</h3>
						<Badge variant={"success"}>{`$${totalPrice}`}</Badge>
					</div>
				)}
			</>
		</div>
	);
};
