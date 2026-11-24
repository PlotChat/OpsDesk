import type { Product } from "@/features/inventory/types/types";

export type Order = {
	id: string;
	customer_name: string;
	status: OrderStatus["id"];
	total_amount: number;
	order_items: OrderItem[];
	created_at: string;
};

export type OrderItem = {
	id: string;
	order_id: Order["id"];
	product_id: Product["id"];
	name: Product["name"];
	quantity: number;
	unit_price: number;
};

export type CreateOrderItemType = Omit<OrderItem, "id" | "order_id">

export type OrderStatus = {
	id: "Shipped" | "Delivered" | "Processing" | "Pending" | "Cancelled";
	description: string;
	sort_order: number;
};

export type OrderSortType = { column: keyof Order; isAscending: boolean };
export type OrderFilterType = {
	search?: string;
	status?: OrderStatus["id"] | null;
};
