import { supabase } from "@/lib/supabase";
import type { Order, OrderItem } from "../types/types";

export async function getOrderItemsByOrderId({ orderId }: { orderId: Order["id"] }) {
	const { data, error, count } = await supabase
		.from("order_items")
		.select("*, ...products(name)", { count: "exact" })
		.eq("order_id", orderId);

	const items = (data ?? []) as OrderItem[];

	const totalPrice = items.reduce(
		(sum, item) => sum + item.unit_price * item.quantity,
		0,
	);

	if (error) {
		throw new Error("Error fetching order items by order id.");
	}

	if (!data) return null;

	return {
		data: (data ?? []) as OrderItem[],
		count: count ?? 0,
		totalPrice,
	};
}
