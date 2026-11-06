export type Order = {
	id: string;
	customer_name: string;
	status: OrderStatus["id"];
	total_amount: number;
	created_at: string;
}

export type OrderStatus = {
	id: "Shipped" | "Delivered" | "Processing" | "Pending" | "Cancelled",
	description: string,
	sort_order: number,
}
