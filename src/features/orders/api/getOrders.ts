import { supabase } from "@/lib/supabase";
import type { Order, OrderFilterType } from "../types/types";
import type { PostgrestError } from "@supabase/supabase-js";
import { calcTotalPages, getPageRange } from "@/lib/utils";
import type {
	FeatureTablePagesProps,
	FeatureTablePagesResponse,
} from "@/components/ui/feature-tables/types";

export async function getOrdersPage({
	sortBy = { column: "created_at", isAscending: false },
	filterBy = { search: "", status: null },
	page,
	pageSize,
}: FeatureTablePagesProps<Order, OrderFilterType>): Promise<FeatureTablePagesResponse<Order>> {
	const { from, to } = getPageRange(page, pageSize);

	/* Declare base query */
	let query = supabase
		.from("orders")
		.select("*", { count: "exact" });

	if (filterBy) {
		if (filterBy.search) {
			query = query.ilike("customer_name", `%${filterBy.search}%`);
		}
		if (filterBy.status) {
			query = query.eq("status", filterBy.status);
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

export type OrderChartPoint = {
	date: string;
	revenue: number;
	orders: number;
};

export async function getOrderChartStats(daysBack = 365): Promise<OrderChartPoint[]> {
	const { data, error } = await supabase.rpc("get_order_chart_stats", {
		days_back: daysBack,
	});

	if (error) {
		throw new Error("Failed to load order analytics");
	}

	return (data ?? []).map((row: OrderChartPoint) => ({
		date: row.date,
		revenue: Number(row.revenue),
		orders: Number(row.orders),
	}));
}
