import { supabase } from "@/lib/supabase";
import type { Order } from "../types/types";
import type { PostgrestError } from "@supabase/supabase-js";

interface OrdersPagesResponse {
	data: Order[];
	totalPages: number | null;
	count: number | null;
	error: PostgrestError | null;
}
export interface OrderPagesProps {
	page: number;
	pageSize: number;
}

export async function getOrdersPage({
	page,
	pageSize,
}: OrderPagesProps): Promise<OrdersPagesResponse> {
	const from = (page - 1) * pageSize;
	const to = page * pageSize - 1;

	const { data, error, count } = await supabase
		.from("orders")
		.select("*", { count: "exact" })
		.range(from, to);

	const totalPages = count !== null ? Math.ceil(count / pageSize) : null;

	if (error) {
		throw new Error("Error when fetching orders");
	}

	return { data, totalPages, count, error };
}

interface OrderResponse {
	data: Order;
	error: PostgrestError | null;
}

export async function getOrder({ id }: { id: string }): Promise<OrderResponse> {
	const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();

	if (error) {
		throw new Error("Error when fetching orders");
	}

	return { data, error };
}
