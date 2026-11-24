import { supabase } from "@/lib/supabase";
import type { CreateOrderItemType, OrderStatus } from "../types/types";

export type CreateOrderPayload = {
	customer_name: string;
	customer_id?: string | null;
	status?: OrderStatus["id"];
	orderItems: CreateOrderItemType[];
};

export async function createOrder({
	customer_name,
	customer_id,
	status,
	orderItems,
}: CreateOrderPayload) {
	const { error } = await supabase.rpc("create_order", {
		p_customer_name: customer_name,
		p_order_items: orderItems,
		p_customer_id: customer_id,
		p_status: status,
	});

	if (error) {
		throw error
	}

	return true;
}
