import { supabase } from "@/lib/supabase";
import type { Order, OrderFilterType, OrderSortType } from "../types/types";
import type { PostgrestError } from "@supabase/supabase-js";
import { calcTotalPages, getPageRange } from "@/lib/utils";
import type { FeatureTablePagesProps, FeatureTablePagesResponse } from "@/types/tables/table-types";
export interface OrderPagesProps extends FeatureTablePagesProps{
	sortBy?: OrderSortType;
	filterBy?: OrderFilterType;
}

export async function getOrdersPage({
	sortBy = { column: "created_at", isAscending: false },
	filterBy = { customer_name: "" },
	page,
	pageSize,
}: OrderPagesProps): Promise<FeatureTablePagesResponse<Order>> {
	const { from, to } = getPageRange(page, pageSize);

	/* Declare base query */
	let query = supabase.from("orders").select("*", { count: "exact" });

	if (filterBy) {
		if (filterBy.customer_name) {
			query = query.ilike("customer_name", `%${filterBy.customer_name}%`);
		}
	}

	/* Start the query with await */
	const { data, error, count } = await query
		.order(sortBy.column, { ascending: sortBy.isAscending })
		.order("id", { ascending: true }) // Extra sort by id to ensure pagination is correct
		.range(from, to);

	const totalPages = calcTotalPages(count, pageSize);

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
