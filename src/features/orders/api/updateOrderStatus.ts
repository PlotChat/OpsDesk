import { supabase } from "@/lib/supabase";
import type { Order, OrderStatus } from "../types/types";

export async function updateOrderStatus({
	orderId,
	newStatus,
}: {
	orderId: Order["id"];
	newStatus: OrderStatus["id"];
}) {
	const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);

	if (error) {
		throw new Error(`Cannot update Order with id: ${orderId}`);
	}

	return true;
}
